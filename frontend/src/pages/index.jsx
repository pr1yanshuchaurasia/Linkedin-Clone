import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
    <div className="conatiner">
      <div className="mainContainer">
        <div className="mainContainer__left">
          <p>Connect with Friends without Exaggeration</p>
          <p>A True social media platform, with stories no blufs !</p>

        </div>
         <div className="mainContainer__right">
          <img src="images/homemain_container.jpg" alt="" />
        </div>
      </div>
    </div>
       
    </>
  );
}
