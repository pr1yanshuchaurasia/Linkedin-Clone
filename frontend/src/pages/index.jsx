import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";

const inter = Inter({
  subsets: ["latin"],
});

export default function Home() {

  const router = useRouter()
  return (
    <>
    <div className= {styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.mainContainer__left}>
          <p>Connect with Friends without Exaggeration</p>
          <p>A True social media platform, with stories no blufs !</p>

          <div onClick={()=>{
            router.push("/login")
          }}className="buttonjoin">
            <p>Join Now</p>
          </div>

        </div>
         <div className={styles.mainContainer__right}>
          <img src="images/homemain.png" alt="" />
        </div>
      </div>
    </div>
       
    </>
  );
}
