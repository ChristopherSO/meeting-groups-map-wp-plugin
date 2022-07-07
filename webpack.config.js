const defaults = require('@wordpress/scripts/config/webpack.config');

module.exports = {
  ...defaults,
  mode: 'production',
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
