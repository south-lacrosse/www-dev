# Testing The Map Dialog

See also [how to set up javascript testing](../../docs/developer-info.md#javascript-and-css-testing-and-minification).

The map needs to be served from a `southlacrosse.org.uk` domain, and called with the SEMLA api key, otherwise Google will reject the request. An easy way to do this is:

1. Create `test/map/gapi.js` with the actual API key as follows:

    ```js
    window.semla = { gapi: 'api-key' };
    ```

1. Run a webserver to serve from `dev.southlacrosse.org.uk`. The best option is to use BrowserSync as that will auto-reload whenever you save any changes, but if you don't have that installed then you can use the built in PHP webserver. You will need to run the webserver from the project root directory as the needs to access files from both the `src` and `test` directories. Run either:
    * `browser-sync start --server --host "dev.southlacrosse.org.uk" --files "test/map" "src/blocks/map" --no-open`
    * `php -S dev.southlacrosse.org.uk:3000`
1. Open <http://dev.southlacrosse.org.uk:3000/test/map/> in your web browser
