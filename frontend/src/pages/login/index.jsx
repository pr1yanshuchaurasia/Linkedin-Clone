import UserLayout from "@/layout/UserLayout";
import React, {useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import {registerUser } from "@/config/redux/action/authAction";


function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const dispath = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);

  const [email, setEmailAddress]=useState("");
  const [password, setPassword]=useState("");
  const [username, setUsername]=useState("");
  const [name, setName]=useState("");

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/login");
    }
  },[authState.loggedIn]);

  const handleRegister = () => {
    console.log("registering....");
    dispath(registerUser({username, password, email, name}));
  };
  return (
    <div>
      <UserLayout>

       
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer__left}>
              <p className={styles.cardleft__heading}>
                {userLoginMethod ? "Sign In" : "Sign Up"}
              </p>

               <p style={{color: authState.isError ? "red":"green"}}>{authState.message.message}</p>

              <div className={styles.inputContainers}>
                <div className={styles.inputRow}>
                  {" "}
                  <input onChange={(e)=>setUsername(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />{" "}
                  <input onChange={(e)=>setName(e.target.value)}
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
                <input onChange={(e)=>setEmailAddress(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Email"
                />
                <input onChange={(e)=>setPassword(e.target.value)}
                  className={styles.inputField}
                  type="text"
                  placeholder="Password"
                />

                <div
                  onClick={() => {
                    if (userLoginMethod) {
                    } else {
                      handleRegister();
                    }
                  }}
                  className={styles.buttonWithOutline}
                >
                  <p>{userLoginMethod ? "Sign In" : "Sign Up"}</p>
                </div>
              </div>
            </div>
            <div className={styles.cardContainer__right}></div>
          </div>
        </div>
      </UserLayout>
    </div>
  );
}

export default LoginComponent;
