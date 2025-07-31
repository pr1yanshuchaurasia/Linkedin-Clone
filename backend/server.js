import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const start = async()=>{
    const connectDB = await mongoose.connect("mongodb+srv://priyanshuchaurasia8840:qSPR5KjOjXAQUGdN@linkedin-clone.2jfivma.mongodb.net/?retryWrites=true&w=majority&appName=Linkedin-clone")

    app.listen(9090, ()=>{
        console.log("Server is running on port 9090");
    })
}
start();