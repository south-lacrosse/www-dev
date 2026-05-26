#!/usr/bin/perl

# find all suffixes in WordPress dirs so we can decide what to block in
# .htaccess
use File::Path;
use FindBin '$Bin';

my $www_dir = "$Bin/../www";
die "No www directory" if ! -d $www_dir;

my %sfx;
suffixesForDir('wp-content');
suffixesForDir('wp-includes');
exit;

sub suffixesForDir {
    my ($dir) = @_;

    %sfx = ();
    processDir("$www_dir/$dir");
    print "\n\n$dir\n";
    for my $suffix (keys %sfx) {
        print " $suffix - $sfx{$suffix}\n";
    }
}


sub processDir {
	my ($inDir) = @_;

	opendir(DIR,"$inDir") || die "opendir $inDir failed";
    my @list = grep(!/^\./,readdir(DIR));
    closedir(DIR);

    foreach my $item (@list) {
        my $inFullName = $inDir.'/'.$item;
        if (-d $inFullName) {
           	processDir($inFullName);
        } elsif (-f $inFullName) {
            $item =~ s/^.*\.([^.]*)$/$1/;
            $sfx{$item}++;
        }
    }
}
