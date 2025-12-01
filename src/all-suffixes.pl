#!/usr/bin/perl

# find all suffixes in WordPress dirs so we can decide what to block in
# .htaccess
use File::Path;
use File::Basename;

die "SEMLA_WWW environment variable not set" if !defined $ENV{'SEMLA_WWW'};
die "SEMLA_WWW environment variable is not a directory ($ENV{'SEMLA_WWW'})" if ! -d $ENV{'SEMLA_WWW'};

my %sfx;
suffixesForDir('wp-content');
suffixesForDir('wp-includes');
exit;

sub suffixesForDir {
    my ($dir) = @_;

    %sfx = ();
    processDir("$ENV{'SEMLA_WWW'}/$dir");
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
