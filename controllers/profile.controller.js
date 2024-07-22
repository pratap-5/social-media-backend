import Post from "../model/post.model.js";
import User from "../model/user.model.js";

//for getting profile
export const getProfile = async (req, res) => {
  try {
    const { profileId } = req.params;

    const user = await User.findById(profileId).populate("posts");
    if (!user) return res.status(400).json({ error: "user not found" });

    const profileData = {
      profileId: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePicPath: user.profilePicPath,
      following: user.followings.length,
      followers: user.followers.length,
      posts: user.posts,
    };
    res.status(200).send(profileData);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

//for searching
export const getSearch = async (req, res) => {
  try {
    const { searchName } = req.params;

    const users = await User.find({}).select("-password");
    if (!users) return res.status(400).json({ error: "no search found" });

    const searchedUser = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(searchName.toLowerCase().trim()) ||
        user.userName.toLowerCase().includes(searchName.toLowerCase().trim())
    );
    res.status(200).send(searchedUser);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

//for getting the followerlist
export const getFollowers = async (req, res) => {
  try {
    const { profileId } = req.params;

    const user = await User.findById(profileId).populate("followers");

    if (!user) return res.status(400).json({ error: "user not found" });

    const followers = user.followers;
    res.status(200).send(followers);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

//for getting followinglist
export const getFollowings = async (req, res) => {
  try {
    const { profileId } = req.params;
    const user = await User.findById(profileId).populate("followings");

    if (!user) return res.status(400).json({ error: "user not found" });

    const followings = user.followings;

    res.status(200).send(followings);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

//for dofollow
export const doFollow = async (req, res) => {
  try {
    const { profileId: followingId } = req.params;
    const followerUser = req.user;
    const followerId = req.user._id;

    const followingUser = await User.findById(followingId).select("-password");

    if (!followingUser || !followerUser)
      return res.status(400).json({ error: "user not found" });

    if (
      followingUser.followers.includes(followerId) ||
      followerUser.followings.includes(followingId)
    )
      return res.status(400).json({ error: "already following" });
    followingUser.followers.push(followerId);
    followerUser.followings.push(followingId);
    await Promise.all([await followingUser.save(), await followerUser.save()]);

    res.status(201).send(true);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

//for do unfollow
export const doUnfollow = async (req, res) => {
  try {
    const { profileId: followingId } = req.params;
    const followerUser = req.user;
    const followerId = req.user._id;

    const followingUser = await User.findById(followingId).select("-password");

    if (!followingUser || !followerUser)
      return res.status(400).json({ error: "user not found" });

    if (
      !followingUser.followers.includes(followerId) &&
      !followerUser.followings.includes(followingId)
    )
      return res.status(400).json({ error: "you do not follow each other" });
    followingUser.followers.splice(
      followingUser.followers.indexOf(followerId),
      1
    );
    followerUser.followings.splice(
      followerUser.followings.indexOf(followingId),
      1
    );

    await Promise.all([await followingUser.save(), await followerUser.save()]);

    res.status(201).send(true);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};

export const getPosts = async (req, res) => {
  try {
    const user = req.user;

    const followings = req.user.followings;

    const getInfo = async () => {
      const allPosts = [];

      const getUser = followings.map(async (userId) => {
        const user = await User.findById(userId).populate("posts");

        user?.posts.forEach((post) => {
          const data = {
            userId: user._id,
            userProfile: user.profilePicPath,
            userName: user.userName,
            fullName: user.fullName,
            post: post,
          };
          allPosts.push(data);
        });
      });

      await Promise.all(getUser);
      return allPosts;
    };

    const posts = await getInfo();

    return res.status(200).send(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
