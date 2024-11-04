# Useful Plugins for Development

We also provide our own [testing plugins](../src/plugins/).

* Query Monitor - query-monitor - adds query data (and much, much more) to web pages to aid debugging
* [WordPress Admin Style](https://github.com/bueltge/wordpress-admin-style) - shows CSS styles used in admin pages, useful for building admin menu php programs
* [BE Media from Production](https://github.com/billerickson/be-media-from-production) - be-media-from-production - uses production media if it doesn't exist locally
* Members - members - adds pages to the Admin dashboard to query/edit roles and capabilities
* Rewrite Rules Inspector - rewrite-rules-inspector - adds an option under Tools to display all the rewrite rules
* WordPress Beta Tester - wordpress-beta-tester - see below
* WP Crontrol - wp-crontrol - all info about Cron jobs

## WordPress Beta Tester

Allows you to load Nightly, Beta, or Release Candidate versions of WordPress. This is useful to test with upcoming releases to make sure it won't break anything. We have automatic updates enabled (which is the default), so it's worth testing locally before any new major release.

Install using Plugins->Add New, or with `wp plugin install wordpress-beta-tester --activate`. Never load this on the production server, only use locally, or possibly in staging.

You can determine which versions can be loaded by going to Tools->Beta Testing. To test the next release choose `Bleeding Edge` and then `Beta/RC Only`. `Nightlies` are likely to have more bugs.
