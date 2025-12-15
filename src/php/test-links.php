<?php
/**
 * Check URLs in supplied file (default work\links.txt) using cURL, and show the
 * HTTP response code, new location if redirected. Also follows links so the
 * last code for each link should be 200.
 *
 * Useful when checking broken links which return a 302 (redirect) response code
 * to see where they go to.  Note that short links such as
 * https://maps.app.goo.gl/2uXRfBfrSQNJATXE8 will always redirect.
 *
 * If this returns nothing then it is possible your firewall is blocking access
 * (Avast and Avira do). To work around that you can disable web shields.
 *
 * Blank lines, and lines starting # or // will be ignored.
 */

$file = __DIR__ . '/work/links.txt';

// 1st arg is script name
if ($argc === 2) {
	$file = $argv[1];
} elseif ($argc > 2) {
	die("Usage: php test-links.php <file>");
}
if (!file_exists($file)) {
	die("File $file does not exist");
}
foreach ( file($file) as $url) {
	$url = trim($url);
	if (!$url || str_starts_with($url, '#') || str_starts_with($url, '//')) continue;
    echo "\n$url\n";
    unset($output);
    exec("curl -I -s -L $url | grep \"HTTP/1.1\|[Ll]ocation: \"", $output, $rc);
	if ($rc !== 0) {
		echo "cURL failed\n";
		continue;
	}
    echo implode("\n",$output);
    echo "\n";
}