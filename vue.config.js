const StyleLintPlugin = require('stylelint-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  publicPath: process.env.NODE_ENV === 'production' ? '/kobo-book-exporter/' : '/',
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Kobo Book Exporter'
        return args
      })
  },
  configureWebpack: () => {
    return {
      plugins: [
        new StyleLintPlugin({
          files: ['**/*.{html,vue,css,sass,scss}'],
          fix: true
        }),
        new CopyWebpackPlugin({
          patterns: [
            { from: 'node_modules/sql.js/dist/sql-wasm.wasm', to: './' }
          ]
        })
      ]
    }
  },
  pwa: {
    name: 'Kobo Book Exporter',
    themeColor: '#0079d2',
    msTileColor: '#0079d2',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      name: 'Kobo Book Exporter',
      hort_name: 'Kobo Book Exporter',
      start_url: '/',
      display: 'standalone',
      theme_color: '#0079d2',
      background_color: '#fff'
    },
    iconPaths: {
      appleTouchIcon: 'img/icons/apple-touch-icon.png',
      maskIcon: null,
      msTileImage: null
    }
  },
  devServer: {
    open: true,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
