import bcrypt from "bcryptjs";
import User from "../model/user.model.js";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

const setDefaultProfile = (gender) => {
  if (gender == "female") {
    return `uploads/default/defaultGirl.jpg`;
  }
  return `uploads/default/defaultBoy.jpg`;
};


export const signUp = async (req, res) => {
  try {
    const { fullName, userName, email, password, confirmPassword, gender } =
      req.body;

    let profilePicPath;
    if (req.file == undefined) {
      profilePicPath = setDefaultProfile(gender);
    } else {
      profilePicPath = `uploads/profiles/${req.file.filename}`;
    }


    if (password !== confirmPassword)
      return res.status(400).json({ error: "password did not match" });
    
    const user = await User.findOne({$or:[{ email},{userName}]});
    
    if (user) return res.status(400).json({ error: "account already exist" });
    
    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashPassword,
      gender,
      profilePicPath
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      return res.status(200).json({
        _id: newUser._id,
        userName: newUser.userName,
        fullName: newUser.fullName,
        email: newUser.email,
        password: newUser.password,
        gender: newUser.gender,
        profilePicPath: newUser.profilePicPath,
        followings: newUser.followings,
        followers: newUser.followers,
        posts: newUser.posts,


      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { emailOrUserName, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrUserName }, { userName: emailOrUserName }],
    });
    if (!user) return res.status(400).json({ error: "email  does not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "password does not match" });
    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      email: user.email,
      password: user.password,
      gender: user.gender,
      profilePicPath: user.profilePicPath,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "internal server erorr " });
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "log out successful" });
  } catch (error) {
    console.log("error in login ", error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
