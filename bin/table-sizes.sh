#!/bin/bash
date
cd ~/public_html/
wp db size --all-tables --size_format=MB --decimals=2
