#!/bin/bash
rsync -av --exclude '.git/' ~/public_html/media/ ~/public_html/sub/stg/media/
