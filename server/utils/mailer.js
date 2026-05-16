/**
 * @fileoverview Email helpers using Brevo (formerly Sendinblue) HTTP API v3
 * This bypasses SMTP port blocking on Railway.
 */
const https = require('https')

/**
 * Send OTP verification email via Brevo API
 * @param {string} to - recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (to, otp) => {
  const senderEmail = process.env.MAIL_USER || 'ecostreaksupport@gmail.com'
  const apiKey = process.env.BREVO_API_KEY || process.env.BREVO_SMTP_KEY

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Verify your EcoStreak account</title>
    </head>
    <body style="margin:0;padding:0;background:#F8FAF5;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAF5;padding:40px 0;">
        <tr>
          <td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;box-shadow:0 8px 32px rgba(27,67,50,0.12);overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#1B4332,#2D6A4F,#52B788);padding:36px 40px;text-align:center;">
                  <div style="font-size:40px;margin-bottom:8px;">🌿</div>
                  <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">EcoStreak</h1>
                  <p style="margin:6px 0 0;color:#95D5B2;font-size:14px;">Your sustainable journey starts here</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <h2 style="margin:0 0 12px;color:#1B4332;font-size:20px;font-weight:700;">Verify your email address</h2>
                  <p style="margin:0 0 28px;color:#4a7c59;font-size:15px;line-height:1.6;">
                    Welcome to EcoStreak! Use the code below to verify your email and activate your account.
                    This code expires in <strong>10 minutes</strong>.
                  </p>
                  <!-- OTP Box -->
                  <div style="background:linear-gradient(135deg,rgba(45,106,79,0.06),rgba(82,183,136,0.06));border:2px solid #d1e7d4;border-radius:16px;padding:32px;text-align:center;margin-bottom:28px;">
                    <p style="margin:0 0 8px;color:#4a7c59;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your verification code</p>
                    <div style="font-size:48px;font-weight:800;color:#2D6A4F;letter-spacing:12px;font-family:'Courier New',monospace;">${otp}</div>
                  </div>
                  <p style="margin:0;color:#4a7c59;font-size:13px;line-height:1.6;">
                    If you didn't create an EcoStreak account, you can safely ignore this email.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#F8FAF5;padding:20px 40px;text-align:center;border-top:1px solid #d1e7d4;">
                  <p style="margin:0;color:#4a7c59;font-size:12px;">🌍 Together we make a difference · EcoStreak</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `

  const data = JSON.stringify({
    sender: { name: 'EcoStreak', email: senderEmail },
    to: [{ email: to }],
    subject: '🌿 Your EcoStreak verification code',
    htmlContent: htmlContent,
  })

  const options = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/smtp/email',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': apiKey,
      'content-type': 'application/json',
      'content-length': Buffer.byteLength(data),
    },
  }

  console.log(`[Mailer] Sending OTP to: ${to} via Brevo API`)

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseBody = ''
      res.on('data', (chunk) => { responseBody += chunk })
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log(`[Mailer] ✅ Email sent successfully! Status: ${res.statusCode}`)
          resolve(JSON.parse(responseBody))
        } else {
          console.error(`[Mailer] ❌ Brevo API Error (${res.statusCode}):`, responseBody)
          resolve(null)
        }
      })
    })

    req.on('error', (err) => {
      console.error(`[Mailer] ❌ Network Error:`, err.message)
      resolve(null)
    })

    req.write(data)
    req.end()
  })
}

module.exports = { sendOTPEmail }
