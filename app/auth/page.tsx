"use client";
import React, { useState } from "react";
import styles from "./auth.module.css";
import { useSearchParams } from "next/navigation";
import { Login, Register } from "@/components/Auth/Auth.component";

const Page = () => {
  const searchParams = useSearchParams();
  const [type, setType] = useState(searchParams.get("type") || "login");

  return <div className={styles.container}></div>;
};

export default Page;
