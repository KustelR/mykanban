"use client";

import { ReactNode, useState } from "react";
import ShowIf from "./ShowIf";

type TextInputProps = {
  id: string;
  label: ReactNode;
  placeholder?: string;
  type?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validators?: Array<validator>;
};

export default function TextInput(props: TextInputProps) {
  const { id, label, placeholder, validators, type, onChange } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const defaultValidationMessages: Array<string> = [];
  const [validationMessages, setValidationMessages] = useState(
    defaultValidationMessages,
  );
  const [data, setData] = useState("");
  return (
    <div className="lg:text-3xl">
      <label htmlFor={id}>{label}</label>

      <div className="relative">
        <span
          className={`${data.length > 0 ? "hidden" : ""} ${isFocused ? "text-xs" : ""} pointer-events-none absolute transition-all duration-200 left-2 text-neutral-400`}
        >
          {placeholder}
        </span>
        <input
          className={`${isValid ? "dark:border-green-700" : ""} invalid:border-red-600 w-full px-2 rounded-md border-[1px] focus:outline-none dark:border-neutral-700 dark:focus:bg-neutral-700 dark:bg-neutral-800 `}
          type={type ? type : "text"}
          id={id}
          onChange={(e) => {
            setData(e.target.value);
            if (validators) {
              const newValidMsgs = validate(e.target, validators);

              if (newValidMsgs.length === 0) {
                setIsValid(true);
              } else {
                setIsValid(false);
              }
              setValidationMessages(newValidMsgs);
            }
            if (onChange && isValid) {
              onChange(e);
            }
          }}
          onFocus={() => {
            setIsFocused(!isFocused);
          }}
          onBlur={(e) => {
            setIsFocused(!isFocused);
            if (validators) {
              const newValidMsgs = validate(e.target, validators);

              if (newValidMsgs.length === 0) {
                setIsValid(true);
              } else {
                setIsValid(false);
              }
              setValidationMessages(newValidMsgs);
            }
          }}
          onInvalid={(e) => {
            e.preventDefault();
          }}
        />
      </div>
      <ShowIf isVisible={validationMessages.length > 0}>
        <ul className="text-sm/6">
          {validationMessages.map((message, idx) => {
            return (
              <li key={idx} className="h-fit">
                <span className=" text-red-600 dark:text-red-400">
                  {message}
                </span>
              </li>
            );
          })}
        </ul>
      </ShowIf>
    </div>
  );
}

function validate(
  target: EventTarget & HTMLInputElement,
  validators: Array<validator>,
): Array<string> {
  let newValidMsgs: Array<string> = [];
  validators.forEach((func) => {
    const [isValid, msg] = func(target.value);
    if (!isValid) {
      newValidMsgs.push(msg);
      target.setCustomValidity(msg);
    } else {
      target.setCustomValidity("");
    }
    target.reportValidity();
  });
  return newValidMsgs;
}
