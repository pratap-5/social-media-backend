import express from "express";

import {
  getProfile,
  getFollowings,
  getFollowers,
  doFollow,
  doUnfollow,
  getPosts,
  getSearch
} from "../controllers/profile.controller.js";
import protectRoute from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/getProfile/:profileId", getProfile);
router.get("/followings/:profileId", getFollowings);
router.get("/followers/:profileId", getFollowers);
router.get("/getPosts", protectRoute, getPosts);
router.get("/search/:searchName", getSearch);


router.post("/doFollow/:profileId", protectRoute, doFollow);
router.post("/doUnfollow/:profileId", protectRoute, doUnfollow);

export default router;
