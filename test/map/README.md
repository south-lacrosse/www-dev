# Testing The Map Dialog

The map needs to be served from a `southlacrosse.org.uk` domain, and called with the SEMLA api key. An easy way to do this is:

1. Create `test/map/gapi.js` with contents

    ```js
    window.semla = { gapi: 'api-key' };
    ```

1. From the project root directory run the PHP web server `php -S dev.southlacrosse.org.uk:8000`
1. Open <http://dev.southlacrosse.org.uk:8000/test/map/index.html> in your web browser.
