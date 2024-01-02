@echo off
rem Display timings of a request using cURL
rem Param is URL and anything else curl accepts

rem -w "@curl-format.txt" tells cURL to use our format file
rem -o /dev/null redirects the output of the request to /dev/null
rem -s tells cURL not to show a progress meter
curl -w "@%~dp0curl-format.txt" -o /dev/null -s %*