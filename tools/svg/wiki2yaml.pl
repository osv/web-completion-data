#!/usr/bin/perl
use strict;
use warnings;
use Data::Dumper;


my $filename = $ARGV[0];

my %tags;
my %attributes;

if (open(my $fh, '<:encoding(UTF-8)', $filename)) {
    print <<EOS;
#SVG attributes
# Source from https://www.w3.org/Graphics/SVG/WG/wiki/Proposals/AttributeWhitespace
attributes:
EOS
    while (my $row = <$fh>) {
        chomp $row;
        my ($attr, $elemsStr, $values) = $row =~m /^
                                                   \|\s*(\w+)\s*
                                                   \|\|\s*(.*?)\s*
                                                   \|\|\s*(.*)/x;

        if (defined $attr && defined $elemsStr) {
            my @elements;
            $elemsStr=~s|\(.*?\)||g;

            foreach my $el (sort split /,/, $elemsStr) {
                $el =~s/^\s*//;
                $el =~s/\s*$//;
                next if $el eq '';

                $tags{$el}{'doc'} = $values;
                push @{$attributes{$attr}{'elements'}}, $el;
                push @{$attributes{$attr}{'doc'}}, $values;
                push @elements, $el;
            }
            my $elStr = join(', ', sort @elements);

            my $docStr = $values;
            $docStr =~s /"/\\"/g;
            $docStr =~s/<nowiki>//;
            $docStr =~s|</nowiki>||;

            # list of values
            my @valuesArr;
            $values =~s/.*?<nowiki>//;
            $values =~s|</nowiki>.*||;

            foreach my $val (split /\|/, $values) {
                $val =~s/^\s*//;
                $val =~s/\s*$//;
                next if $val eq '';
                next if $val =~m/</;
                next if $val =~m/\(/;
                next if $val =~m/\[/;
                push @valuesArr, $val;
            }

            my $valueStr = join ', ', sort @valuesArr;

            print <<EOS;

  - $attr:
      t: [ $elStr ]
      d: "$docStr"
      v: [ $valueStr ]
EOS

        }
    }

                print <<EOS;

# SVG elements
tags:
EOS

    foreach my $el (sort keys %tags) {
        print "  $el: \n\n";
    }
} else {
    warn "Could not open file '$filename' $!";
}

sub uniq {
    my %seen;
    grep !$seen{$_}++, @_;
    grep defined $seen{$_}++, @_;
}
