import React from "react";
import styles from "../auth.module.css";
import { Login } from "@/components/Auth/Auth.component";

const Page = () => {
  return (
    <div className={styles.container}>
      <Login />
    </div>
  );
};

export default Page;
