git config --global user.name "Your Name"
rem to protect your email in GitHub use your xxx@users.noreply.github.com email
rem see https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-user-account/setting-your-commit-email-address
git config --global user.email xxx@users.noreply.github.com

git config --global core.autocrlf true

rem replace with your editor of choice, used to add commit messages and other stuff
git config --global core.editor "'C:/Program Files (x86)/Notepad++/notepad++.exe' -multiInst -nosession"

rem useful shortcuts to display history
git config --global alias.lol "log --oneline --graph --decorate"
git config --global alias.tree "log --oneline --decorate --all --graph"

git config --list
