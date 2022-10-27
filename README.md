### 프로젝트 생성
```
npx create-electron-app electron-app
```

### 프로젝트 리액트 추가

```
npm install --save react react

npm install --save-dev @babel/core @babel/preset-env @babel/preset-react babel-loader css-loader style-loader sass-loader sass webpack webpack-cli

mkdir src/js

mkdir src/css

```

#### webpack.common.js setting
```
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/js/index.js',
  devtool: 'inline-source-map',
  target: 'electron-renderer',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              '@babel/preset-env', {
                targets: {
                  esmodules: true
                }
              }],
              '@babel/preset-react']
          }
        }
      },
      {
        test: [/\.s[ac]ss$/i, /\.css$/i],
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'build', 'js'),
  },
};
```
### make electron file

```
// main.js

const {app, BrowserWindow, Notification} = require('electron')
const path = require('path')

/**
 * @description how to use notifications in electron
 * @see https://github.com/electron/electron/blob/v20.1.0/docs/tutorial/notifications.md
 */

module.exports = showNotification = () => {
  const NOTIFICATION_TITLE = 'Basic Notification'
  const NOTIFICATION_BODY = 'Notification from the Main process'  
  new Notification({ title: NOTIFICATION_TITLE, body: NOTIFICATION_BODY }).show()
}

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration:true
    }
  })
  mainWindow.loadFile('index.html');
  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow();
  showNotification();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


// renderer.js
```

### set packaeg.json && add script
```
{
  "main": "main.js",
  "scripts": {
    "watch": "webpack --config webpack.common.js --watch",
  }
}
```


### 실행
```
npm run watch

npm run start

```

### react-router
 * https://seolahchloe.tistory.com/entry/Git-%EC%98%A4%EB%A5%98%ED%95%B4%EA%B2%B0-Updates-were-rejected-because-the-tip-of-your-current-branch-is-behind-its-remote
 * 라우팅 최신정보  v6
 * https://velog.io/@soryeongk/ReactRouterDomV6