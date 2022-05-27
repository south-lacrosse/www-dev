# VS Code Setup

See also [VSCode Editor Basics](https://code.visualstudio.com/Docs/editor/codebasics).

You can edit both repositories in the same workspace using a [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces). Make sure you save the workspace with File->Save Workspace As... to something like `C:\local\southlacrosse-repos\south-lacrosse.code-workspace`, and the you can run VSCode with that workspace with `code C:\local\southlacrosse-repos\south-lacrosse.code-workspace`.

If you have installed the node modules you will want to exclude those from the workspace, otherwise you will see a lot of JavaScript files, and they will be included in searches. Go to File->Preferences->Settings, search for `files.exclude` and add `**/node_modules`. You will probably want to do this in your User settings, but if not then pick Workspace.

You may find the following extensions useful:

* Apache Conf mrmlnc.vscode-apache - syntax highlighting for Apache .htaccess and .conf files
* Code Spell Checker streetsidesoftware.code-spell-checker - [see below](#code-spell-checker-configuration)
* CSS Formatter aeschli.vscode-css-formatter
* Debugger for Chrome msjsdiag.debugger-for-chrome - debug JavaScript in Chrome browser
* ESLint dbaeumer.vscode-eslint - lints (checks style & formatting) your JavaScript code
* Git History donjayamanne.githistory - git log, file history, compare
* GitLens eamodio.gitlens - alternative to Git History, more heavyweight, adds lots of git functionality like file history views etc.
* iCalendar af4jm.vscode-icalendar -  syntax highlighting for iCal files if you are testing calendar output
* MySQL formulahendry.vscode-mysql - run any SQL file from VSCode
* PHP Debug felixfbecker.php-debug
* PHP Intelephense bmewburn.vscode-intelephense-client - code completion for PHP, and much more
* WordPress Snippet tungvn.wordpress-snippet - WordPress snippets and auto-completions

And also the follow settings may be useful. To get to settings go to File->Preferences->Settings

* Editor: Linked Editing - set to rename paired HTML/XML tags, surprisingly useful

## Code Spell Checker Configuration

If you use the Code Spell Checker extension then you should switch the language to en-GB, and use our custom dictionary to add words used in this project which aren't in the standard dictionaries. Add the following in your workspace configuration under "settings" (which should be the file you created to handle the multi-root workspace, e.g. south-lacrosse.code-workspace).

```json
"cSpell.language": "en-GB",
"cSpell.customDictionaries": {
    "semla-words": {
        "name": "semla-words",
        "path": "${workspaceFolder:www-dev}/.vscode/cspell-dictionary.txt",
        "description": "SEMLA words",
        "addWords": true
    }
}
```
