#!/usr/bin/perl

# Lossless (or possibly lossy) optimization for images recursively in
# directories specified on the command line. Defaults to running in test mode
# where no files are updated. To modify the files run with the --go flag.

# Once run you can use the 'wp semla-media sizes' WP-CLI command to update the
# WordPress image file size meta data.

# Tools used are:
# 	JPEG using MozJPEG - https://github.com/mozilla/mozjpeg
# 	PNG using OptiPNG - http://optipng.sourceforge.net/
# both of which must be installed.

use strict;
use File::Basename;
use File::Copy; # move
use File::Find;
use constant {
	ALLOW_LOSSY => 0, # set to 1 to allow lossy compression
};

my $test_run = 1;  # if set just display how many bytes would have been saved

my @not_installed = ();
my @tools = ('jpegtran', 'optipng');
push @tools,'cjpeg' if ALLOW_LOSSY;
foreach ( @tools ) {
	`$_ -version 2>&1`;
	push @not_installed, $_ if ($? == -1);
}
if ( @not_installed > 0 ) {
	print "Required software is not installed: " . (join ' ', @not_installed)
		. "\n";
	exit 1;
}

if ( @ARGV < 1 ) {
	help(0);
}

my @search_paths = ();
my $error = 0;
foreach (@ARGV) {
	if ($_ eq '--help' || $_ eq '-?') {
		help(0);
	}
	if ($_ eq '--go') {
		$test_run = 0;
		next;
	}
	if (! -d $_) {
		print "Unknown directory: $_\n";
		$error = 1;
	} else {
		push @search_paths, $_;
	}
}

if ( $error || @search_paths < 1 ) {
	help(1);
}

my $count_images = 0;
my $count_modified = 0;
my $count_jpegtran = 0;
my $count_lossy = 0;
my $count_optipng = 0;
my $bytes_saved = 0;
my $bytes_orig = 0;

print "TESTING ONLY - no images will be overwritten\n"
	. "Use --go option to modify files\n" if $test_run;

find(\&jpegCompress, @search_paths);

print "\n\n";
print "----------------------------\n";
print "  Sumary\n";
print "----------------------------\n";
print "\n";
print "  Inspected $count_images image files.\n";
print "  Modified $count_modified files.\n";
print "  JPEG optimizations: $count_jpegtran\n";
print "  JPEG lossy optimizations: $count_lossy\n" if ALLOW_LOSSY;
print "  PNG optimizations: $count_optipng\n";
print "  Total bytes saved: $bytes_saved (orig $bytes_orig, saved "
	   . (int($bytes_saved/$bytes_orig*10000) / 100) . "%)\n" if $bytes_orig;
print "\n";
exit 0;

sub jpegCompress() {
	if (m/^\..+/) {
	   $File::Find::prune = 1;
	   return;
	}
	if (m/\.jpe?g$/i) {
		$count_images++;
		my $orig_size = -s $_;

		# Run optimizations, then inspect which was best.
		`jpegtran -copy none -optimize -progressive $_ > $_.opt`;
		my $opt_size = -s "$_.opt";

		my $lossy_size = 0;
		if (ALLOW_LOSSY) {
			`cjpeg -optimize -progressive -quality 70 $_ > $_.lossy`;
			$lossy_size = -s "$_.lossy";
		}
		if ($opt_size && $opt_size < $orig_size && (!ALLOW_LOSSY || $opt_size <= $lossy_size)) {
			move("$_.opt", "$_") unless $test_run;
			report_saved($File::Find::name, 'jpegtran', $orig_size, $opt_size);
			$count_jpegtran++;
		} elsif ($lossy_size && $lossy_size < $orig_size) {
			move("$_.lossy", "$_") unless $test_run;
			report_saved($File::Find::name, 'jpegtran lossy', $orig_size, $lossy_size);
			$count_lossy++;
		}

		# Cleanup temp files
		unlink("$_.opt") if -e "$_.opt";
		unlink("$_.lossy") if ALLOW_LOSSY && -e "$_.lossy";
	} elsif (m/^(.*)\.png$/i) {
		$count_images++;
		my $orig_size = -s $_;
		my $basename = $1;

		`optipng -o7 -strip all -quiet -out $_.opt $_`;
		my $opt_size = -s "$_.opt";

		if ($opt_size && $opt_size < $orig_size) {
			move("$_.opt", "$basename.png") unless $test_run;
			report_saved($File::Find::name, 'OptiPNG', $orig_size, $opt_size);
			$count_optipng++;
		}
		unlink("$_.opt") if -e "$_.opt";
	}
}

sub report_saved {
	my ($filename, $method, $orig_size, $new_size) = @_;

	my $saved = $orig_size - $new_size;
	$bytes_orig += $orig_size;
	$bytes_saved += $saved;
	$count_modified++;

	print "$filename - $method saved $saved bytes (orig $orig_size) "
		. (int($saved/$orig_size*10000) / 100) . "%\n";

}

sub help {
	my ($code) = @_;
	print "Optimize jpg and png files using MozJPEG and OptiPNG\n";
	print "Usage: perl " . basename($0) . " directory1 [directory2...] [--go] [--help|-?]\n";
	print "  run without the --go flag to just show what would have been updated";
	exit $code;
}
