const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
const less = require('less');
const port = 3000

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// home = 首页
// searchResult = 搜索结果页
// goodsDetail = 商品详情页
const activePage = 'home'

// 监听 less 文件变化并编译
const lessFilePath = path.join(__dirname, `source/${activePage}.less`);
fs.watchFile(lessFilePath, (curr, prev) => {
  if (curr.mtime !== prev.mtime) {
    compileLessToCSS();
  }
});

// 编译 less 文件为 css
function compileLessToCSS() {
  fs.readFile(lessFilePath, 'utf8', (err, data) => {
    if (err) throw err;

    less.render(data, { paths: [path.dirname(lessFilePath)] })
      .then(
        output => {
          const cssFilePath = path.join(__dirname, 'public', `${activePage}.css`);
          fs.writeFileSync(cssFilePath, output.css);
          console.log('\x1b[32m', 'LESS => CSS： 编译成功');
        },
        err => {
          console.log('\x1b[31m', `LESS => CSS：编译失败: ${err}`);
        }
      );
  });
}

// 初次启动时编译 less 文件
compileLessToCSS();

// 启动服务器
app.listen(port, () => {
  console.log('\x1b[34m', `服务启动成功： http://127.0.0.1:${port}/${activePage}.css`);
});