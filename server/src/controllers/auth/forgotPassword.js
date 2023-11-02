require("dotenv").config();
const { users } = require("@models");
const jwt = require("jsonwebtoken");
const nodeoutlook = require("nodejs-nodemailer-outlook");
const { messages } = require("@utils");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const findUser = await users.findOne({ email });
  if (!findUser) {
    return res.status(400).json({ message: messages.userNotFound });
  }
  const secret = process.env.JWT_SECRET;
  const payload = {
    id: findUser.userId,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "15m" });
  const url = process.env.APP_URL;
  const id = findUser.userId;

  findUser.passwordResetToken = token;

  await findUser.save();

  const link = `${url}/api/v1/auth/reset-password/${id}/${token}`;

  nodeoutlook.sendEmail({
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
    from: process.env.EMAIL,
    to: email,
    subject: "Password Reset",
    html: `<h3><b>Password Reset</b> </h3>
              <div>
                <p>We have received a request to reset your password.</p>
                <p>${link}</p>
                <p>This link expires in 15 minutes</p>
                <p>If this wasn't you contact the admin to suspend any current transactions until further notice.</p>
                </div>`,
    //text: 'This is text version!',
    onError: (e) => {
      console.log(e);
      return res.status(400).json({ message: messages.requestFailed });
    },
    onSuccess: (i) => {
      return res.status(200).json({
        message: messages.passwordResetEmail,
      });
    },
  });
};

module.exports = { forgotPassword };
