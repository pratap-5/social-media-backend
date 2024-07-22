import Post from "../model/post.model.js";

export const upload = async (req, res) => {
  try {
    const { description } = req.body;
    const userId = req.user._id;
    const file = req.file;
    const filePath = `uploads/${
      file.mimetype.startsWith("image") ? "images" : "videos"
    }/${file.filename}`;

    if (!filePath) {
      return res.status(400).json({ error: "file is not uploaded" });
    }

    const post = new Post({
      userId,
      filePath,
      description,
    });

    if (post) {
      req.user.posts.push(post._id);

      await Promise.all([await req.user.save(), await post.save()]);

      return res.status(200).json({ msg: "file succefully uploaded " });
    }

   
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "internal server error" });
  }
};
