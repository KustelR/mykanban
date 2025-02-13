"use client";
import ShowIf from "@/shared/ShowIf";
import TextButton from "@/shared/TextButton";
import TextInput from "@/shared/TextInput";
import { useRef, useState } from "react";

export default function AuthForm(props: {
  isNewUserDefault?: boolean;
  className?: string;
}) {
  const { isNewUserDefault, className } = props;
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(
    isNewUserDefault !== undefined ? isNewUserDefault : true,
  );

  return (
    <div
      className={`border-[1px] p-2 rounded-xl dark:border-neutral-800 dark:bg-neutral-900${className}`}
    >
      <ShowIf isVisible={isNewUser}>
        <form className="space-y-2" action="">
          <TextInput
            id="signup_email"
            label="Email"
            placeholder="example@example.com"
            validators={emailValidators}
          />
          <TextInput
            id="signup_username"
            label="Username"
            placeholder="someguy1993"
          />
          <TextInput
            id="signup_password"
            label="Password"
            type="password"
            validators={passwordValidators}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <TextInput
            id="signup_confirm_password"
            label="Confirm password"
            type="password"
            validators={[
              (input) => {
                if (input !== password) {
                  return [false, "Passwords not match"];
                }
                return [true, ""];
              },
            ]}
          />
          <TextButton>Sign Up</TextButton>
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
        <form action="">
          <TextInput
            id="signin_email"
            label="Email"
            placeholder="example@example.com"
          />{" "}
          <TextInput id="signin_password" type="password" label="Password" />
          <TextButton>Sign in</TextButton>
        </form>
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

const passwordValidators: Array<validator> = [
  (input) => {
    if (input.length < 8)
      return [false, "Password should be at least 8 symbol long"];
    else return [true, ""];
  },
  (input) => {
    const matched = input.match(/[0-9]+/);
    return [
      matched !== null && matched.length > 0,
      "Password should contain numbers",
    ];
  },
];
