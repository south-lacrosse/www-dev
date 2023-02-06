#!/usr/bin/perl

# Lossless (or possibly lossy) optimization for images recursively in a directory
# Tools used are:
# 	JPEG using MozJPEG - https://github.com/mozilla/mozjpeg
# 	PNG,GIF using OptiPNG - http://optipng.sourceforge.net/

use strict;
use File::Find;
use File::Copy;

my $TEST = 1;  # set to 1 to just display how many bytes would have been saved

my $allow_lossy = 0; # set to 1 to allow lossy compression

my @search_paths = @ARGV ? @ARGV : 
	(
		'C:/local/repos/southlax-www/media',
		'C:/local/repos/southlax-www/other-dir',
	);

my $count_images = 0;
my $count_pngs = 0;
my $count_gifs = 0;
my $count_modified = 0;
my $count_jpegtran = 0;
my $count_lossy = 0;
my $count_optipng = 0;
my $bytes_saved = 0;
my $bytes_orig = 0;

print "TESTING ONLy - no images will re overwritten" if $TEST;

find(\&jpegCompress, @search_paths);

print "\n\n";
print "----------------------------\n";
print "  Sumary\n";
print "----------------------------\n";
print "\n";
print "  Inspected $count_images image files.\n";
print "  Modified $count_modified files.\n";
print "  JPEG optimizations: $count_jpegtran\n";
print "  JPEG lossy optimizations: $count_lossy\n" if $allow_lossy;
print "  PNG optimizations: $count_optipng\n";
print "  Total bytes saved: $bytes_saved (orig $bytes_orig, saved "
       . (int($bytes_saved/$bytes_orig*10000) / 100) . "%)\n" if $bytes_orig;
print "\n";

sub jpegCompress() {
    if (m/\.jpg$/i) {
        $count_images++;
        my $orig_size = -s $_;

        print "Inspecting $File::Find::name\n";

        # Run optimizations, then inspect which was best.
		`jpegtran -copy none -optimize -progressive $_ > $_.opt`;
        my $opt_size = -s "$_.opt";

        my $lossy_size = 0;
		if ($allow_lossy) {
			`cjpeg -optimize -progressive -quality 70 $_ > $_.lossy`;
	        $lossy_size = -s "$_.lossy";
		}
		 if ($opt_size && $opt_size < $orig_size && (!$allow_lossy ||$opt_size <= $lossy_size)) {
            move("$_.opt", "$_") unless $TEST;
            my $saved = $orig_size - $opt_size;
            $bytes_saved += $saved;
            $bytes_orig += $orig_size;
            $count_modified++;
            $count_jpegtran++;

            print " -- jpegtran JPEG optimization: "
				. "saved $saved bytes (orig $orig_size) "
       			. (int($saved/$orig_size*10000) / 100) . "%\n";

        } elsif ($lossy_size && $lossy_size < $orig_size) {
            move("$_.lossy", "$_") unless $TEST;
            my $saved = $orig_size - $lossy_size;
            $bytes_saved += $saved;
            $bytes_orig += $orig_size;
            $count_modified++;
            $count_lossy++;

            print " -- jpegtran lossy JPEG optimization: "
				. "saved $saved bytes (orig $orig_size) "
       			. (int($saved/$orig_size*10000) / 100) . "%\n";
        }

        # Cleanup temp files
        if (-e "$_.opt") {
            unlink("$_.opt");
        }
        if (-e "$_.lossy") {
             unlink("$_.lossy");
        }
    } elsif (m/^(.*)\.png$/i) {
        $count_images++;
        my $orig_size = -s $_;
		my $basename = $1;

        print "Inspecting $File::Find::name\n";

		`optipng -quiet -out $_.opt $_`;

        my $opt_size = -s "$_.opt";

        if ($opt_size && $opt_size < $orig_size) {
            move("$_.opt", "$basename.png");
            my $saved = $orig_size - $opt_size;
            $bytes_saved += $saved;
            $bytes_orig += $orig_size;
            $count_modified++;
            $count_optipng++;

            print " -- OptiPNG optimization: "
				. "saved $saved bytes (orig $orig_size)"
       			. (int($saved/$orig_size*10000) / 100) . "%\n";

        }
        if (-e "$_.opt") {
            unlink("$_.opt");
        }
    }
}