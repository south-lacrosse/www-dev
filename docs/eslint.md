# Eslint Notes

## Config

Prior to `@wordpress/scripts` version 31.4 (ish) the `@wordpress/eslint-plugin` rules allowed for the `@wordpress` packages to not be installed locally (e.g. `@wordpress/blocks`). In 31.4 these rules were removed, presumably to force users to install all the `@wordpress` packages so that they would get all the intellisense and type checking that would provide.

For now we have just added those rules back into our `eslint.config.mjs` file (settings "import/internal-regex" and rule "import/no-unresolved") so that linting passes.

We might want to add all the packages locally in `package.json` as below, and remove those config settings.

```json
"dependencies": {
    "@wordpress/api-fetch": "latest",
    "@wordpress/block-editor": "latest",
    "@wordpress/blocks": "latest",
    "@wordpress/components": "latest",
    "@wordpress/core-data": "latest",
    "@wordpress/data": "latest",
    "@wordpress/dom-ready": "latest",
    "@wordpress/element": "latest",
    "@wordpress/editor": "latest",
    "@wordpress/hooks": "latest",
    "@wordpress/plugins": "latest",
    "@wordpress/primitives": "latest",
    "@wordpress/server-side-render": "latest",
    "@wordpress/url": "latest",
    "@wordpress/icons": "^13.1.0"
},
"devDependencies": {
    "@wordpress/scripts": "^31.4.0",
    ...
}
```
