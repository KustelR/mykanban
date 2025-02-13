"use client";
import ShowIf from "@/shared/ShowIf";
import TextInput from "@/shared/TextInput";
import { useState } from "react";

export default function AuthForm(props: {
  isNewUserDefault?: boolean;
  className?: string;
}) {
  const { isNewUserDefault, className } = props;
  const [isNewUser, setIsNewUser] = useState(
    isNewUserDefault !== undefined ? isNewUserDefault : true,
  );
  return (
    <div
      className={`border-[1px] p-2 rounded-xl dark:border-neutral-800 dark:bg-neutral-900${className}`}
    >
      <ShowIf isVisible={isNewUser}>
        <form action="">
          <TextInput
            id="signup_email"
            label="Email"
            placeholder="example@example.com"
            validators={emailValidators}
          />
        </form>
        <span>Already have an account? </span>
        <button
          onClick={() => {
            setIsNewUser(!isNewUser);
          }}
        >
          <strong>Sign in</strong>
        </button>
      </ShowIf>
      <ShowIf isVisible={!isNewUser}>
        <form action=""></form>
        <span>Don't have an account? </span>
        <button
          onClick={() => {
            setIsNewUser(!isNewUser);
          }}
        >
          <strong>Sign up</strong>
        </button>
      </ShowIf>
    </div>
  );
}

const emailValidators: Array<validator> = [
  (input: string) => {
    const matched = input.match(/.*@.*/);
    return [
      matched !== null && matched.length > 0,
      'Provided incorrect email: Sholud containt "@"',
    ];
  },
  (input: string) => {
    const matched = input.match(/.+.+\..*/);
    return [
      matched !== null && matched.length > 0,
      'Provided incorrect email: Should contain "."',
    ];
  },
  (input: string) => {
    const matched = input.match(/.+@.+\..+/);
    return [matched !== null && matched.length > 0, "Provided incorrect email"];
  },
];
