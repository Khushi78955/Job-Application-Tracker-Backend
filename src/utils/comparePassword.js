import bcrypt from "bcrypt";

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export default comparePassword;