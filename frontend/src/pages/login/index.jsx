import UserLayout from "@/layout/UserLayout";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./style.module.css";

function LoginComponent() {
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  const [userLoginMethod, setUserLoginMethod] = useState(false);
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  });
  return (
    <div>
      <UserLayout>
        <div className={styles.container}>
          <div className={styles.cardContainer}>
            <div className={styles.cardContainer__left}>
              <p className={styles.cardleft__heading}>
                {userLoginMethod ? "Sign In" : "Sign Up"}
              </p>
              <div className={styles.inputContainers}>
                <div className={styles.inputRow}>
                  {" "}
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                  />{" "}
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                  />
                </div>
                 <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Password"
                  />
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
