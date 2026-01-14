@echo off
rem Find out unused CSS in site.

rem Download most pages from dev, which should have all used CSS classes in them.
rem Downloads only if folder work\dev.southlacrosse.org.uk does not exist, so
rem delete that to re-download.

rem Assumes purgecss is installed `npm i -g purgecss`

setlocal
cd %~dp0

if not exist work (
	mkdir work
	mkdir work\before
	mkdir work\after
)
copy ..\..\south-lacrosse\app\public\wp-content\themes\lax\style.css work\before\ /y
copy ..\..\south-lacrosse\app\public\wp-content\plugins\semla\css\flags.css work\before\ /y
copy ..\..\south-lacrosse\app\public\wp-content\plugins\semla\css\map.css work\before\ /y
cd work || exit 1
copy before\*.css .
if not exist dev.southlacrosse.org.uk (
	rem use -r -l inf instead of --mirror as local server won't send modified date
	wget -r -l inf --follow-tags=a -e robots=off --adjust-extension --no-verbose ^
		--no-check-certificate --reject-regex "(api/semla|\?(date|team|comp|club))" ^
		https://dev.southlacrosse.org.uk
	rem get specific URLs e.g. different types of fixtures pages that aren't directly linked
	wget --force-directories --no-check-certificate --adjust-extension --no-verbose ^
		--input-file=../unused-extra-urls.txt
) else (
	echo Pages already downloaded to dev.southlacrosse.org.uk, so using those
)

echo Running purgecss
call purgecss --css *.css --content dev.southlacrosse.org.uk/**/*.html --output after/

diff -r before after > css.diff

echo Before and after CSS are in work\before and work\after, a diff is in work\css.diff
