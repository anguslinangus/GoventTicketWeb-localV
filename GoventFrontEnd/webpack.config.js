const path = require('path');

module.exports = {
  entry: './src/index.js', // 入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: 'bundle.js' // 输出文件名
  },
  modules: {
    rules: [
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              outputPath: 'images', // 我習慣會把圖片輸出到 images 這個資料夾
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // 可能还包含其他插件配置
  ]
};