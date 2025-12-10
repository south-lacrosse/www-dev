#!/bin/bash
rsync -av --delete --exclude '.git/' ~/public_html/media/ ~/public_html/sub/stg/media/
