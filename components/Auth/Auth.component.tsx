"use client";
import React, { useState } from "react";
import styles from "./Auth.module.css";
import Alert from "../Alert/Alert.component";
import { login, register } from "@/lib/auth";
import axios from "axios";
import { redirect, usePathname , useRouter } from "next/navigation";

export const Login = () => {

  const router = useRouter()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [incorrectEmail, setIncorrectEmail] = useState(false);
  const [notEnoughData, setNotEnoughData] = useState(false);
  const [loggingInFailed, setLoggingInFailed] = useState(false);
  const pathname = usePathname()

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIncorrectEmail(false);
    setNotEnoughData(false);
    let validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log("Email being tested:", email);
    console.log("Regular expression test result:", validRegex.test(email));
    if (!validRegex.test(email)) {
      setIncorrectEmail(true);
      return;
    }
    if (!email || !password) {
      setNotEnoughData(true);
      return;
    }
    try {
      const response = await login(email, password);
      console.log("Logging in successful:", response);
      if(response){
        await axios.post("/api/auth/signin", {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          username: response.username,
          email: response.email,
          pfp: response.pfp
        });
        let userData = await (
          await axios.get("/api/readCookies/session")
        ).data;
        localStorage.setItem("session-data", userData.userData);
        localStorage.setItem(
          "refreshTokenExpires",
          userData.refreshTokenExpires
        );
        localStorage.setItem(
          "accessTokenExpires",
          userData.accessTokenExpires
        );
        router.back()
      }else{
          console.error("Invalid access or refresh token received");
          setLoggingInFailed(true);
      }
      return response;
    } catch (error) {
      console.error("Logging in failed:", error);
      setLoggingInFailed(true);
      return error;
    }
  };
  return (
    <div className={styles.registerContainer}>
      {incorrectEmail && <Alert content="This is not a correct email" />}
      {notEnoughData && (
        <Alert content="You must enter email, username and password" />
      )}
      {loggingInFailed && (
        <Alert content="Logging in failed. Please try again later..." />
      )}
      <form
        onSubmit={(e) => {
          handleSubmit(e)
        }}
      >
        <label htmlFor="email">Email: </label>
        <input
          name="email"
          id="email"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">Password: </label>
        <input
          name="password"
          minLength={8}
          maxLength={12}
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sing in</button>
      </form>
    </div>
  );
};
export const Register = ({
  usedEmails,
  usedUsernames,
}: {
  usedEmails: Array<string>;
  usedUsernames: Array<string>;
}) => {

  const router = useRouter()

  const [email, setEmail] = useState("");
  const [file, setFile] = useState<File>()
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);
  const [usernameTaken, setUsernameTaken] = useState(false);
  const [incorrectEmail, setIncorrectEmail] = useState(false);
  const [notEnoughData, setNotEnoughData] = useState(false);
  const [registrationFailed, setRegistrationFailed] = useState(false);
  // console.log(Cookies.get('_jwtAccessToken'), Cookies.get('_jwtRefreshToken'))
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setEmailTaken(false);
    setUsernameTaken(false);
    setIncorrectEmail(false);
    setNotEnoughData(false);
    let validRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    console.log("Email being tested:", email);
    console.log("Regular expression test result:", validRegex.test(email));
    if (usedEmails.includes(email)) {
      setEmailTaken(true);
      return;
    }
    if (usedUsernames.includes(username)) {
      setUsernameTaken(true);
      return;
    }
    if (!validRegex.test(email)) {
      setIncorrectEmail(true);
      return;
    }
    if (!username || !email || !password || !file) {
      setNotEnoughData(true);
      return;
    }
    try {
      const response = await register(email, password, username, file);
      console.log("Register successful:", response);
      return response;
    } catch (error) {
      console.error("Register failed:", error);
      return error;
    }
  };

  return (
    <div className={styles.registerContainer}>
      {emailTaken && (
        <Alert content="There already is an account using this email" />
      )}
      {usernameTaken && (
        <Alert content="There already is an account using this username" />
      )}
      {incorrectEmail && <Alert content="This is not a correct email" />}
      {notEnoughData && (
        <Alert content="You must enter email, username and password" />
      )}
      {registrationFailed && (
        <Alert content="Creating user failed. Please try again later..." />
      )}
      <form
        onSubmit={(e) => {
          handleSubmit(e)
            .then(async (res) => {
              if (res.accessToken && res.refreshToken) {
                // Cookies.set('_jwtAccessToken', res.accessToken, { expires: 1 });
                // Cookies.set('_jwtRefreshToken', res.refreshToken, { expires: 7 });

                console.log(
                  await axios.post("/api/auth/register", {
                    accessToken: res.accessToken,
                    refreshToken: res.refreshToken,
                    username: res.username,
                    email: res.email,
                    pfp:res.pfp
                  })
                );
                let userData = await (
                  await axios.get("/api/readCookies/session")
                ).data;
                localStorage.setItem("session-data", userData.userData);
                localStorage.setItem(
                  "refreshTokenExpires",
                  userData.refreshTokenExpires
                );
                localStorage.setItem(
                  "accessTokenExpires",
                  userData.accessTokenExpires
                );
                console.log(
                  "sids",
                  userData,
                  localStorage.getItem("session-data"),
                  localStorage.getItem("accessTokenExpires"),
                  localStorage.getItem("refreshTokenExpires")
                );
                // location.reload()
                router.back()
                
                // router.refresh()
              } else {
                console.error("Invalid access or refresh token received:", res);
                setRegistrationFailed(true);
              }


            })
            .catch((error) => {
              console.log(error);
              setRegistrationFailed(true);
            });
        }}
      >
        <label htmlFor="email">Email: </label>
        <input
          name="email"
          id="email"
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="username">Username: </label>
        <input
          name="username"
          minLength={2}
          maxLength={12}
          id="username"
          type="text"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="password">Password: </label>
        <input
          name="password"
          minLength={8}
          maxLength={12}
          id="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="file">Profile picture: </label>
        <input
          type="file"
          name="file"
          id="file"
          required
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0])}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};
