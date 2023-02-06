#!/usr/bin/perl

# find all suffixes in WordPress dirs so we can decide what to block
# in .htaccess
use File::Path;
use File::Basename;

# get www dir from .npmrc
open my $fh, '<', dirname($0) . '/../.npmrc' or die "Unable to open file:$!\n";
my %ini = map { split /=|\s+/; } <$fh>;
close $fh;
die "www not set in .npmrc" if !exists($ini{www}) ;

my %sfx;
suffixesForDir('wp-content');
suffixesForDir('wp-includes');
exit;

sub suffixesForDir {
    my ($dir) = @_;

    %sfx = ();
    processDir("$ini{www}/$dir");
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
