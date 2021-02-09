import { createTransport, getTestMessageUrl } from 'nodemailer';

const transporter = createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === 'true',
  auth: {
    user: process.env.MAIL_USER, // generated ethereal user
    pass: process.env.MAIL_PASS, // generated ethereal password
  },
});

function makeANiceEmail(text: string): string {
  return `
    <div style="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello there!</h2>
      <p>${text}</p>
      <p>😘, Ramsy de Vos</p>
    </div>
  `;
}

export async function sendPasswordResetEmail(
  resetToken: string,
  to: string
): Promise<void> {
  // email the user a token
  const info = await transporter.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset token',
    html: makeANiceEmail(`Your password reset token is here!

    <a href="${process.env.FRONTEND_URL}/password/reset?token=${resetToken}">Click here to reset your password.</a>
    `),
  });

  if (process.env.MAIL_USER.includes('ethereal.email')) {
    console.log(`✉️ Message Sent! Preview it at ${getTestMessageUrl(info)}`);
  }
}
