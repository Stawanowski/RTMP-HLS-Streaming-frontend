import Link from "next/link";
import React from "react";
import styles from './AuthLinks.module.css'
export const LoginLink = () => {
  return <Link 
            href={"/auth/login"}
            className={styles.LoginLink__container}
        >
            Login
        </Link>;
};
export const RegisterLink = () => {
  return <Link 
        href={"/auth/register"}
        className={styles.RegisterLink__container}
    >
        Register
    </Link>;
};
