/*
 * @Author: mmmmmmmm
 * @Date: 2022-07-20 12:24:57
 * @Description: 邮箱操作
 */
import nodemailer from "nodemailer";
import moment from "moment";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { GET_ENV_NUMBER_VARIABLE, GET_ENV_STRING_VARIABLE } from "@/utils";
import Mail from "nodemailer/lib/mailer";

/**@name 邮箱配置 */
export const EMAIL_CONFIG = {
  service: GET_ENV_STRING_VARIABLE("email.service"),
  port: GET_ENV_NUMBER_VARIABLE("email.port"), // SMTP 端口
  secureConnection: true, // 使用了 SSL
  auth: {
    user: GET_ENV_STRING_VARIABLE("email.user"),
    // 这里密码不是qq密码，是你设置的smtp授权码
    // 获取qq授权码请看:https://jingyan.baidu.com/article/6079ad0eb14aaa28fe86db5a.html
    pass: GET_ENV_STRING_VARIABLE("email.pass"),
  },
} as SMTPTransport.Options;

export default class EmailControl {
  /**@name 发送邮件 */
  static async sendEmail(body: Mail.Options, senders: string[] | string) {
    const transporter = nodemailer.createTransport(EMAIL_CONFIG);
    return await transporter
      .sendMail({
        from: `"VPS运维" <${GET_ENV_STRING_VARIABLE("email.user")}>`, // sender address
        to: Array.isArray(senders) ? senders.join(",") : senders, // list of receivers
        ...body,
      })
      .finally(() => {
        transporter.close();
      });
  }
}
