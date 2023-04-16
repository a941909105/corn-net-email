使用 vnstat 每日监控流量，并通过邮件发送通知
需要在public下创建common.yml
```
# 邮箱服务
email:
  # 对应的邮箱服务 如163、qq
  service: 
  # SMTP 端口 需要查询对应供应商
  port: 
  # 邮箱账号
  user: 
  # 邮箱授权码（非用户密码）
  pass: 
vps:
  title: 
  IP: 
cron:
  sendEmail: "0 30 6 1-31 * *"
  sendUser:
    - a941909105@163.com
```
还需要创建 development.yml和production.yml 暂时没用
框架 webpack5 + ts
测试环境在node:16.x
需要安装 vnstat2.x + pnpm

```
运行命令 
pnpm i 
pnpm dev
pnpm build // 打包
pm2 start pm2.json // 通过pm2运行
pnpm prod //命令运行
```