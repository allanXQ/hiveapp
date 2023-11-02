const getGoogleAuthTokens = require("@utils/getGoogleAuthTokens");
require("dotenv").config();
const uuid = require("uuid");
const jwt = require("jsonwebtoken");
const { users } = require("@models");
const { generateTokens, setCookies } = require("@utils");
const { messages } = require("@utils");

const id = uuid.v4();

const UserSuccess = async (res, findUser, email) => {
  const tokens = generateTokens(findUser);
  const userUpdate = await users.updateOne(
    { email },
    { $set: { refreshToken: tokens.refreshToken } }
  );
  if (userUpdate.nModified === 0) {
    return res.status(400).json({ message: messages.loginFailed });
  }
  setCookies(res, tokens);
  const payloadString = findUser.userId;

  return res.redirect(
    301,
    `${process.env.CLIENT_URL}/google-callback?userId=${payloadString}`
  );
};

const googleOAuth = async (req, res) => {
  try {
    const code = req.query.code;
    const { id_token, access_token } = await getGoogleAuthTokens(code);
    const decoded = jwt.decode(id_token);
    const { email, name } = decoded;
    const findUser = await users.findOne({ email });
    if (findUser) return await UserSuccess(res, findUser, email);
    const createUser = await users.create({
      userId: id,
      email,
      googleName: name,
      status: "Verified",
      authMethod: "google",
    });
    if (!createUser) {
      return res.status(400).json({ message: messages.loginFailed });
    }
    return await UserSuccess(res, createUser, email);
  } catch (error) {
    console.log(error);
    const message = messages.loginFailed;
    return res.redirect(
      301,
      `${process.env.CLIENT_URL}/login?message=${encodeURIComponent(message)}`
    );
  }
};

module.exports = { googleOAuth };
