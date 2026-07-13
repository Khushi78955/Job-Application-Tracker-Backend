import bcrypt from "bcrypt"

const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}

export default hashPassword;