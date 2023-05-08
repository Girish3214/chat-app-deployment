import jwt from "jsonwebtoken";

const createTokenUser = (user) => {
  return { name: user.name, _id: user._id, email: user.email };
};

const createJWT = (user) => {
  const token = jwt.sign(createTokenUser(user), process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
  return token;
};

const isTokenValid = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

export { createJWT, isTokenValid, createTokenUser };
