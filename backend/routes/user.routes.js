import { Router } from "express";
import {
  login,
  register,
  uploadProfilePicture,
  updateUserProfile,
  getUserAndProfile,
  updateProfileData,
  getAllUserProfile,
} from "../controllers/user.controller.js";
import multer from "multer";
import { get } from "http";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.route("/update_profile_picture")
.post(upload.single('profilePicture'), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").get(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileData);
router.route("/user/get_all_users").get(getAllUserProfile);
router.route("/user/download_resume")

export default router;
