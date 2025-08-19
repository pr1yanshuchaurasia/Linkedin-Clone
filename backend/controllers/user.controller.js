import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import PDFdocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connections.model.js";
import { connect } from "http2";

const convertUserDataTOPDF = async (userData) => {
  const doc = new PDFdocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {
    align: "center",
    width: 100,
  });
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`);
  doc.fontSize(14).text(`Bio: ${userData.bio || "No bio available"}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);

  doc.fontSize(14).text("Past Work: ");
  userData.pastWork.forEach((work, index) => {
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  });

  doc.end();

  return outputPath;
};

export const register = async (req, res) => {
  console.log(req.body);

  try {
    const { name, username, email, password } = req.body;

    // Check for missing fields
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Correctly check if user already exists in the DB
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Create user profile
    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({ message: "User doesn't found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });
    return res.json({ token });
  } catch (error) {}
};

export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.profilePicture = req.file.filename;

    await user.save();

    return res
      .status(200)
      .json({ message: "Profile picture updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body; //...spread Operator token nikal ke  sab kuch userdata me daal do..
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser || String(existingUser._id) !== String(user._id)) {
        return res.status(400).json({ message: "User already exists" });
      }
    }
    Object.assign(user, newUserData);
    await user.save();

    return res.json({ message: "User Updated" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserAndProfile = async (req, res) => {
  try {
    const { token } = req.body;

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const userProfile = await Profile.findOne({ userId: user._id }).populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json(userProfile);
  } catch (error) {
    return;
  }
};

export const updateProfileData = async (req, res) => {
  try {
    const { token, ...newProfileData } = req.body;

    const userProfile = await User.findOne({ token: token });

    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({
      userId: userProfile._id,
    });

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();

    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllUserProfile = async (req, res) => {
  try {
    const profiles = await Profile.find().populate(
      "userId",
      "name username email profilePicture"
    );

    return res.json(profiles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const downloadProfile = async (req, res) => {
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({ userId: user_id }).populate(
    "userId",
    "name username email profilePicture"
  );

  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({ message: outputPath });
};

export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection user not found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id,
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Connection request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();
    return res.json({ message: "Connection request sent successfully" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyConnectionsRequests = async (req,res)=>{

  const { token } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const connection = await ConnectionRequest.find({userId: user._id})
    .populate("connectionId", "name username email profilePicture");

    return res.json(connection);

  }catch(error){
    return res.status(500).json({ message: error.message });
  }
}

export const whatAreMyConnections = async (req, res) => {
  const { token } = req.body;
  try{
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connections = await ConnectionRequest.find({connectionId: user._id})
    .populate("userId", "name username email profilePicture");

    return res.json(connections);

  }catch(error){
    return res.status(500).json({ message: error.message });
  } 
}

export const acceptConnectionRequest = async (req, res) => {
  const { token, requestId, action_type } = req.body;

  try {
    const user = await User.findOne({ token });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const connection = await ConnectionRequest.findOne({ _id: requestId });

    if( !connection) {
      return res.status(404).json({ message: "Connection request not found" });
    }
    if(action_type === "accept"){
      connection.status_accepted = true;
    }else{
      connection.status_accepted = false;
    }

    await connection.save();
    return res.json({ message: "Connection request updated successfully" });
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


export const commentPost = async (req,res)=>{
  const {token, post_id, commentBody} = req.body;

  try{
    const user = await User.findOne({token: token}).select("_id");
    if(!user){
      return res.status(404).json({ message: "User not found" });
    }
    const post = await Post.findOne({_id: post_id});
    if(!post){
      return res.status(404).json({ message: "Post not found" });
    }
    const comment_to_add = new Comment({
      userId: user._id,
      postId: post._id,
      comment: commentBody,
    })
    await comment.save();
    return res.status(200).json({ message: "Comment added successfully" });
  }catch (error) {
    return res.status(500).json({ message: error.message });
  }

}