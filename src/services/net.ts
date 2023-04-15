/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-15 22:29:41
 * @Description: 超时
 */
import http from "http";
// 创建一个 HTTP 请求的选项
const options = {
  hostname: "baidu.com", // 请求的主机名
  port: 80, // 请求的端口号
  path: "/", // 请求的路径
  method: "GET", // 请求的方法
  timeout: 5000,
};
// 判断是否被墙
export async function judgeWall(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // 发起 HTTP 请求
    const req = http.request(options, (res) => {
      resolve(true);
    });
    req.on("error", (err) => {
      console.error("请求错误", err);
      resolve(false);
    });
    req.on("timeout", () => {
      req.abort(); // 中止请求
      console.error("请求超时");
      reject(false);
    });
    // 发送请求
    req.end();
  });
}
