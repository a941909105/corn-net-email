/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-15 21:51:11
 * @Description: 文件描述
 */

// const { exec } = require("child_process");
// const http = require("http");
// const url = "http://121.40.228.54/";

// const req = http.get(url);
// req.setTimeout(5000,()=>{});
// /**@name 检查有没有墙 */
// async function judgeWall() {
//   return new Promise((resolve, reject) => {
//     exec("ping www.baidu.com", (error, stdout, stderr) => {
//       if (error) {
//         return reject(new Error(`ping失败 ${error.message}`));
//       }
//       if (stderr) {
//         return reject(new Error(`stderr失败 ${stderr}`));
//       }
//       resolve(stdout);
//     });
//   });
// }
// judgeWall().then(console.log);

const http = require("http");

// 创建一个 HTTP 请求的选项
const options = {
  hostname: "baidu.com", // 请求的主机名
  port: 80, // 请求的端口号
  path: "/", // 请求的路径
  method: "GET", // 请求的方法
  timeout: 5000,
};

// 发起 HTTP 请求
const req = http.request(options, (res) => {
  console.log(`HTTP 请求成功，状态码：${res.statusCode}`);

  // 处理响应数据
  res.on("data", (chunk) => {
    console.log(`接收到响应数据：${chunk}`);
  });
});
req.on("timeout", () => {
  console.log("请求超时");
  req.abort(); // 中止请求
});
// 发送请求
req.end();
