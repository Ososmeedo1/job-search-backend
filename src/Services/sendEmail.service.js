import nodemailer from 'nodemailer'


export const sendEmailService = async ({ to = "", subject = "", otp}) => {


  const transporter = nodemailer.createTransport({
    host: process.env.PORT,
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER_SEND_EMAIL_SERVICE,
      pass: process.env.PASSWORD_SEND_EMAIL_SERVICE
    },
    service: "gmail"
  });


  const info = await transporter.sendMail({
    from: "ormeedo@gmail.com",
    to,
    subject,
    html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <title>OTP Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center">
            <table width="400" cellpadding="20" cellspacing="0" style="background-color: #ffffff; border-radius: 6px;">
              <tr>
                <td style="text-align: center;">
                  <h2 style="margin-bottom: 10px;">Job-search</h2>
                  <p>Your One-Time Password (OTP) is</p>
                  <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">
                    ${otp}
                  </p>
                  <p style="font-size: 12px; color: #555;">
                    This OTP will expire in 5 minutes.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `
  })

  return info
}