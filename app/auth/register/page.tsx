import React from "react";
import styles from "../auth.module.css";
import { Register } from "@/components/Auth/Auth.component";
import axios from "axios";

const Page = async () => {
  const alreadyRegistered = await (
    await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_ADRESS}/api/v1/users/alreadyUsed`
    )
  ).data;

  const getUsernames = () => {
    let temp = [];
    for (let i = 0; i < alreadyRegistered.length; i++) {
      temp.push(alreadyRegistered[i].username);
    }
    return temp;
  };
  const getEmails = () => {
    let temp = [];
    for (let i = 0; i < alreadyRegistered.length; i++) {
      temp.push(alreadyRegistered[i].email);
    }
    return temp;
  };

  return (
    <div className={styles.container}>
      <Register usedEmails={getEmails()} usedUsernames={getUsernames()} />
    </div>
  );
};

export default Page;
