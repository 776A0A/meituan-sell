const appData = require('./data.json');
const { seller, goods, ratings } = appData;

const path = require('path');
function resolve(dir) {
  // 这个__dirname 是项目的根目录， 相当于进行了路径的拼接
  return path.join(__dirname, dir);
}

module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        import: ['./src/theme'],
      },
    },
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true,
    },
  },
  devServer: {
    before(app) {
      app.get('/api/seller', (req, res) => {
        res.json({
          errno: 0,
          data: seller,
        });
      });

      app.get('/api/goods', (req, res) => {
        res.json({
          errno: 0,
          data: goods,
        });
      });

      app.get('/api/ratings', (req, res) => {
        res.json({
          errno: 0,
          data: ratings,
        });
      });
    },
  },
  chainWebpack(config) {
    config.resolve.alias
      .set('components', resolve('src/components'))
      .set('common', resolve('src/common'))
      .set('api', resolve('src/api'));
  },
};
