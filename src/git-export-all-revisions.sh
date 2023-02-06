# Useful script to export all versions of a file in Git - adds sha to file, can limit to certain dates etc
#age is epoch time http://www.epochconverter.com/
mkdir exportfolder
for sha in `git rev-list --max-age=1370217600 HEAD -- southlax-web/web/minutes.pdf`; do
    git show ${sha}:southlax-web/web/minutes.pdf > exportfolder/minutes-${sha}.pdf
done