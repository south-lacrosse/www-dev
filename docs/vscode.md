# VS Code Setup

See also [VSCode Editor Basics](https://code.visualstudio.com/Docs/editor/codebasics).

You should edit both repositories in the same workspace using a [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces). We provide a workspace file in `\south-lacrosse.code-workspace` in this repository, which you can use with `code www-dev\south-lacrosse.code-workspace`, or from inside VSCode with File->Open Workspace from File...

It assumes you are using [Local](localwp.md), and that this repo is installed in the Local Sites path, so the setup would be:

```txt
localwp   (sites path)
├── south-lacrosse
│   ├── app
│   │   ├── public   (www repo)
│   │   └── ...
│   └── ...
└── www-dev   (this repo)
```

If you have a different configuration then the `.code-workspace` file is a simple JSON file, so you can make a copy outside of this repo, and edit the directories.

When you first open the workspace you should see a message "This workspace has extension recommendations". You could trust us and "Install All" (you can always disable or uninstall them later), or pick "Show Recommendations" to see what extensions we recommend and select which ones to install. They include things like PHP intellisense, PHP debugging, a spell checker which works in code, MYSQL client etc.

You can also see this list by going to Extensions and putting `@recommended` in the search.

For Git history we recommend the "Git History" extension, but you may prefer GitLens, which is more heavyweight, and adds lots of Git functionality like file history views etc., or simply use another tool like [GitHub Desktop](https://desktop.github.com/).

The workspace file also includes useful settings, including:

* It will exclude `**/node_modules`, as otherwise they will clutter up the workspace, and make the search take ages
* Configure the Code Spell Checker extension
