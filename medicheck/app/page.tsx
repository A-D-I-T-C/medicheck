// References: https://github.com/vahid-nejad/next-auth-custom-login-page/blob/main/app/auth/signIn/page.tsx
"use client";
import Button from "../components/elements/Button";
import TextBox from "../components/elements/TextBox";
import React, { useRef } from "react";

const LoginPage = () => {
  const userName = useRef("");
  const pass = useRef("");

  // const onSubmit = async () => {
  //   const result = await signIn("credentials", {
  //     username: userName.current,
  //     password: pass.current,
  //     redirect: true,
  //     callbackUrl: "/",
  //   });
  // };
  return (
    <div
      className={
        "flex flex-col justify-center items-center  h-screen bg-gradient-to-br gap-1 from-cyan-300 to-sky-600"
      }
    >
      <div className="px-7 py-4 shadow bg-white rounded-md flex flex-col gap-2">
        <TextBox
          labelText="User Name"
          onChange={(e) => (userName.current = e.target.value)}
        />
        <TextBox
          labelText="Password"
          type={"password"}
          onChange={(e) => (pass.current = e.target.value)}
        />
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default LoginPage;