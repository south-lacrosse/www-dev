# VS Code Setup

See also [VSCode Editor Basics](https://code.visualstudio.com/Docs/editor/codebasics).

This setup assumes the `www` repo is cloned inside the `www-dev` repo, so:

```txt
www-dev   (this repo)
└── www   (www repo + WordPress)
```

Because the `www` folder is included in the `www-dev\.gitignore` file (so that it isn't committed with `www-dev`), it is best to set up VSCode as a multi-root workspace, so that `www-dev` and `www` are considered workspace roots. Otherwise VSCode will not show files under `www` when you use `Ctrl-P` or search.

We provide a workspace file in `south-lacrosse.code-workspace` in this repository, which you can use with `code www-dev\south-lacrosse.code-workspace`, or from inside VSCode with `File->Open Workspace from File...`.

If you have a different configuration then the `.code-workspace` file is a simple JSON file, so you can make a copy outside of this repo to use.

When you first open the workspace you should see a message "This workspace has extension recommendations". You could trust us and "Install All" (you can always disable or uninstall them later), or pick "Show Recommendations" to see what extensions we recommend and select which ones to install. They include things like PHP intellisense, PHP debugging, a spell checker which works in code, MYSQL client etc.

You can also see this list by going to Extensions and putting `@recommended` in the search.

For Git history we recommend the "Git History" extension, but you may prefer GitLens, which is more heavyweight, and adds lots of Git functionality like file history views etc., or simply use another tool like [GitHub Desktop](https://desktop.github.com/).

The workspace file also includes useful settings, including:

* It will exclude `**/node_modules`, as otherwise they will clutter up the workspace, and make the search take ages
* Exclude the `www` directory within `www-dev`, so you only see `www` as a separate root
* Configure the Code Spell Checker extension
