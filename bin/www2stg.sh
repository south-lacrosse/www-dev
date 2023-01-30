#!/bin/bash
# Copy production media and database to staging
cd $(dirname "$0")
./media-www2stg.sh
if [[ -f ~/public_html/wp-content/plugins/semla/core/notices.html ]]; then
	cp ~/public_html/wp-content/plugins/semla/core/notices.html ~/public_html/sub/stg/wp-content/plugins/semla/core
else
	rm ~/public_html/sub/stg/wp-content/plugins/semla/core/notices.html
fi
./db-www2stg.sh
