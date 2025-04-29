const nodemailer = require("nodemailer");
const sendMail = async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Đảm bảo đây là đúng
    port: 587,
    secure: false, // true cho port 465, false cho các port khác
    auth: {
      user: process.env.EMAIL_NAME, // Đảm bảo email và app password được cấu hình trong .env
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // Gửi email
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <maddison53@ethereal.email>', // địa chỉ người gửi
    to: email, // danh sách người nhận
    subject: "Reset Password", // Tiêu đề email
    text: "Xin chào, vui lòng kiểm tra link reset mật khẩu của bạn!", // nội dung text
    html: html, // nội dung html
  });

  return info
}

module.exports = sendMail