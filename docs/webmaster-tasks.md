# Webmaster Tasks

Useful information about regular tasks the Webmaster should perform.

## Check Broken Links

This probably only needs to be done every couple of months. You should run this on a local copy of the website, so download the latest backup and load it using `bin/load-production-backup.sh`.

Note: `https://content.googleapis.com/` and `https://maps.gstatic.com/` will probably show up as errors. They are used in `<link rel='preconnect'>` tags so just refer to domains that should be looked up early, but most tools assume these are pages, and those URLs return 404s.

There are many ways to do this, but the following work well for Windows:

* [Xenu's Link Sleuth](http://home.snafu.de/tilman/xenulink.html) - old, but still good. Make sure to exclude `tel:` and `data:` URLs otherwise you will see excessive messages.
* [SEO Macroscope](https://nazuke.github.io/SEOMacroscope/blog/) - add the line `add_filter('pre_option_blog_public', function() { return '1'; },99);` into `wp-content/plugins/semla/semla.php` to test sitemaps (and don't forget to remove that line after!).
