"use client";

import { ReactNode, useState } from "react";
import React from "react";

type TextInputProps = {
  className?: string;
  id: string;
  label: ReactNode;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  validators?: Array<validator>;
  area?: boolean;
};

export default function TextInput(props: TextInputProps) {
  const {
    id,
    label,
    placeholder,
    validators,
    type,
    defaultValue,
    onChange,
    area,
    className,
  } = props;
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const defaultValidationMessages: Array<string> = [];
  const [validationMessages, setValidationMessages] = useState(
    defaultValidationMessages,
  );
  const [data, setData] = useState("");

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>

      <div className="relative">
        <span
          className={`${data.length > 0 ? "hidden" : ""} ${isFocused ? "text-xs" : ""} pointer-events-none absolute transition-all duration-200 left-2 text-neutral-400`}
        >
          {!area && placeholder}
        </span>
        {!area && (
          <input
            className={`${isValid ? "dark:border-green-700" : ""} invalid:border-red-600 focus:bg-neutral-200 w-full px-2 rounded-md border-[1px] focus:outline-none dark:border-neutral-700 dark:focus:bg-neutral-700 dark:bg-neutral-800 `}
            type={type ? type : "text"}
            id={id}
            autoComplete="off"
            placeholder={defaultValue}
            onChange={(e) => {
              validateInput(
                e.target,
                setData,
                setIsValid,
                setValidationMessages,
                validators,
              );
              if (onChange && isValid) onChange(e);
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
        )}
        {area && (
          <textarea
            className={`${isValid ? "dark:border-green-700" : ""} invalid:border-red-600 w-full h-fit px-2 rounded-md border-[1px] focus:outline-none focus:bg-neutral-200 dark:border-neutral-700 dark:focus:bg-neutral-700 dark:bg-neutral-800 `}
            id={id}
            placeholder={
              placeholder && placeholder.length < 20
                ? placeholder
                : `${placeholder?.slice(0, 10)}...`
            }
            onChange={(e) => {
              validateInput(
                e.target,
                setData,
                setIsValid,
                setValidationMessages,
              );
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
        )}
      </div>
      {validationMessages.length > 0 && (
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
      )}
    </div>
  );
}

function validate(
  target: HTMLInputElement | HTMLTextAreaElement,
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
function validateInput(
  target: HTMLInputElement | HTMLTextAreaElement,
  setData: (arg: string) => void,
  setIsValid: (arg: boolean) => void,
  setValidationMessages: (arg: string[]) => void,
  validators?: Array<validator>,
): void {
  let isValid: boolean = false;
  if (validators && validators.length > 0) {
    const newValidMsgs = validate(target, validators);

    if (newValidMsgs.length === 0) {
      isValid = true;
    }
    setValidationMessages(newValidMsgs);
  } else {
    isValid = true;
  }
  setIsValid(isValid);
  setData(target.value);
}
