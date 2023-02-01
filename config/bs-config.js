
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 | Make sure you set the values under the https option.
 |
 | If you are running Local then the key and certificate files will be created for
 | you, and can be found in the Local router config which you can find by going
 | into Local, and in the menu click Reveal Local Router's Logs, and the certificates
 | will be in the certs folder.
 |
 | If BrowserSync hangs then a possible cause is the URL resolving to ::1. To fix
 | that go to your hosts file and make sure it's set to 127.0.1.1, e.g. Local
 | creates:
 |
 | ::1 dev.southlacrosse.org.uk #Local Site
 | 127.0.0.1 dev.southlacrosse.org.uk #Local Site
 |
 | so comment out the first line (i.e. start it with #).
 */
module.exports = {
  ui: {
    port: 3001
  },
  files: [
    "wp-content/themes/lax/*.css",
    "wp-content/themes/lax/**/*.js",
    "wp-content/themes/lax/**/*.php",
    "wp-content/plugins/semla/**/*.css",
    "wp-content/plugins/semla/**/*.js",
    "wp-content/plugins/semla/**/*.php"
  ],
  watchEvents: [
    "change"
  ],
  watch: false,
  ignore: [],
  single: false,
  watchOptions: {
    ignoreInitial: true
  },
  server: false,
  proxy: "https://dev.southlacrosse.org.uk",
  port: 3000,
  https: {
    key: "C:/Users/{user here}/AppData/Roaming/Local/run/router/nginx/certs/dev.southlacrosse.org.uk.key",
    cert: "C:/Users/{user here}/AppData/Roaming/Local/run/router/nginx/certs/dev.southlacrosse.org.uk.crt"
  },
  middleware: false,
  serveStatic: [],
  ghostMode: {
    clicks: true,
    scroll: true,
    location: true,
    forms: {
      submit: true,
      inputs: true,
      toggles: true
    }
  },
  logLevel: "info",
  logPrefix: "Browsersync",
  logConnections: false,
  logFileChanges: true,
  logSnippet: true,
  rewriteRules: [],
  open: false,
  browser: "default",
  cors: false,
  xip: false,
  hostnameSuffix: false,
  reloadOnRestart: false,
  notify: true,
  scrollProportionally: true,
  scrollThrottle: 0,
  scrollRestoreTechnique: "window.name",
  scrollElements: [],
  scrollElementMapping: [],
  reloadDelay: 0,
  reloadDebounce: 500,
  reloadThrottle: 0,
  plugins: [],
  injectChanges: true,
  startPath: null,
  minify: true,
  host: "dev.southlacrosse.org.uk",
  localOnly: false,
  codeSync: true,
  timestamps: true,
  clientEvents: [
    "scroll",
    "scroll:element",
    "input:text",
    "input:toggles",
    "form:submit",
    "form:reset",
    "click"
  ],
  socket: {
    socketIoOptions: {
      log: false
    },
    socketIoClientConfig: {
      reconnectionAttempts: 50
    },
    path: "/browser-sync/socket.io",
    clientPath: "/browser-sync",
    namespace: "/browser-sync",
    clients: {
      heartbeatTimeout: 5000
    }
  },
  tagNames: {
    less: "link",
    scss: "link",
    css: "link",
    jpg: "img",
    jpeg: "img",
    png: "img",
    svg: "img",
    gif: "img",
    js: "script"
  },
  injectNotification: false
};
