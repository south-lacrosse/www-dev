// remove some plugins from svg optimization

module.exports = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // we want the viewbox
          removeViewBox: false,
          // leave in title for accessability
          removeTitle: false
        },
      },
    },
  ],
};