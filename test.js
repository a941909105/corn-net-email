const nodemailer = require('nodemailer');

// 创建发送邮件的 transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'a941909105@gmail.com', // 发送邮件的 Gmail 帐号
    pass: 'malegebi1' // 发送邮件的 Gmail 帐号的密码或授权码
  }
});

// 配置邮件选项
const mailOptions = {
  from: 'a941909105@gmail.com', // 发送邮件的 Gmail 帐号
  to: '941909105@qq.com', // 收件人的电子邮件地址
  subject: '测试邮件', // 邮件主题
  text: '这是一封测试邮件。' // 邮件内容
};

// 发送邮件
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('发送邮件失败:', error);
  } else {
    console.log('发送邮件成功:', info.response);
  }
});
