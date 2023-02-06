#!/bin/bash
# Test that certain URLs are blocked

cat uris.txt | tr -d '\r' | sed 's/.*/https:\/\/dev.southlacrosse.org.uk\/& -o \/dev\/null/'| xargs curl --silent --write-out '%{url_effective}\t%{http_code}\n'
