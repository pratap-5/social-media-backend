import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15d" });

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true, //prevent the xss attacks cross origin scripting attacks
    sameSite: "strict", // Required for cross-origin requests
    secure:  process.env.MODE_ENV !== "devlopment",
  });
};
export default generateTokenAndSetCookie;