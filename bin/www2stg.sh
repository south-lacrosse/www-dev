#!/bin/bash
# Copy production media and database to staging
cd $(dirname "$0")
./media-www2stg.sh
./db-www2stg.sh
