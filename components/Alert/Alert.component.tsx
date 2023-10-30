import React from "react";
import styles from "./Alert.module.css";
const Alert = ({ content }: { content: string }) => {
  return (
    <div className={styles.container}>
      <h4>{content}</h4>
    </div>
  );
};

export default Alert;
