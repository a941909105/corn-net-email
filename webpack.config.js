/*
 * @Author: mmmmmmmm
 * @Date: 2023-04-15 17:23:35
 * @Description: 文件描述
 */
const path = require("path");
const fs = require("fs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");
const { spawn } = require("child_process");
let currentProcess = null;

module.exports = {
  mode: "none",
  target: "node",
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    // filename: "main.js",
    clean: true,
  },
  devtool:
    process.env.NODE_ENV === "production" ? "inline-source-map" : "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
  },

  plugins: [
    // 配置 copy-webpack-plugin 插件，将 public 目录中的文件复制到输出目录
    // new CopyWebpackPlugin({ patterns: [{ from: "public", to: "./public" }] }),
    {
      apply: (compiler) => {
        if (process.env.NODE_ENV === "production") {
          return;
        }
        compiler.hooks.afterEmit.tap("AfterEmitPlugin", () => {
          if (currentProcess) {
            currentProcess.kill();
          }
          // 在这里执行您的代码
          const mainFile = path.join(__dirname, "dist/main.js");
          console.log("Webpack 打包完成，执行自定义代码...", mainFile);

          currentProcess = spawn("node", [mainFile]);
          // 监听子进程的 stdout 和 stderr 输出
          currentProcess.stdout.on("data", (data) => {
            console.log(data.toString());
          });

          currentProcess.stderr.on("data", (data) => {
            console.error(data.toString());
          });

          // 监听子进程的退出事件
          currentProcess.on("close", (code) => {
            console.log("代码运行完毕");
          });
        });
      },
    },
  ],
  externals: [nodeExternals()],

  module: {
    rules: [{ test: /\.([cm]?ts|tsx)$/, loader: "ts-loader" }],
  },
};
