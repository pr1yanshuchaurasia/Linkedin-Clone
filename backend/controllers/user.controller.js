import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";
import PDFdocument from "pdfkit"; 
import fs from "fs";


const convertUserDataTOPDF = async (userData)=>{
  const doc = new PDFdocument();

  const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";
  const stream = fs.createWriteStream("uploads/" + outputPath);
  doc.pipe(stream);

  doc.image(`uploads/${userData.userId.profilePicture}`, {align:"center",width: 100})
  doc.fontSize(14).text(`Name: ${userData.userId.name}`);
  doc.fontSize(14).text(`Username: ${userData.userId.username}`);
  doc.fontSize(14).text(`Email: ${userData.userId.email}`); 
  doc.fontSize(14).text(`Bio: ${userData.bio || "No bio available"}`);
  doc.fontSize(14).text(`Current Position: ${userData.currentPost}`);
  
  doc.fontSize(14).text("Past Work: ")
  userData.pastWork.forEach((work, index)=>{
    doc.fontSize(14).text(`Company Name: ${work.company}`);
    doc.fontSize(14).text(`Position: ${work.position}`);
    doc.fontSize(14).text(`Years: ${work.years}`);
  })

  doc.end();

  return outputPath;

}


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

  try{
    const {token, ...newUserData}= req.body; //...spread Operator token nikal ke  sab kuch userdata me daal do..
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {username, email} = newUserData;

    const existingUser = await User.findOne({
      $or:[{ username }, { email }],
    });

    if(existingUser){
      if(existingUser || String(existingUser._id) !== String(user._id)){
      return res.status(400).json({ message: "User already exists" });
       }
    }
    Object.assign(user,newUserData);
    await user.save();

    return res.json({message:"User Updated"})

  }catch(error){
    return res.status(500).json({ message: error.message });
  }
}

export const getUserAndProfile = async (req, res) => {
   
  try{
    const {token} = req.body;

    const user = await User.findOne({token:token});
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const userProfile = await Profile.findOne({userId: user._id})
    .populate("userId", "name username email profilePicture");

    return res.json(userProfile);
   

  }catch(error){
    return

  }
}

export const updateProfileData = async (req, res) => {
  try{
    const {token, ...newProfileData} = req.body;

    const userProfile = await User.findOne({ token: token });

    if(!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile_to_update = await Profile.findOne({userId: userProfile._id});

    Object.assign(profile_to_update, newProfileData);
    await profile_to_update.save();

    return res.json({ message: "Profile updated successfully" });

  }catch(error){
    return res.status(500).json({ message: error.message });
  }
}

export const getAllUserProfile = async (req,res)=>{
  try{
    const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

    return res.json(profiles);

  }catch(error){
    return res.status(500).json({ message: error.message });
  }
}

export const downloadProfile = async (req,res)=>{
  const user_id = req.query.id;

  const userProfile = await Profile.findOne({userId: user_id}).populate('userId', 'name username email profilePicture');

  let outputPath = await convertUserDataTOPDF(userProfile);

  return res.json({"message": outputPath});

}