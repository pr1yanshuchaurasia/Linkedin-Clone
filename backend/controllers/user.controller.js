import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import crypto from "crypto";

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

export const login = async (req,res)=>{
  try{
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(404).json({ message: "User doesn't found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
      return res.status(400).json({message:"Invalid Credentials"})
    }

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({_id: user._id}, { token });
    return res.json({token});

  }catch(error){

  }
} 