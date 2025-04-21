import * as React from "react";

export interface AlertProps {
  type: "success" | "fail";
  children: React.ReactNode;
}

const GenericAlertClassNames = "absolute border-2 p-2 m-2";

export function Alert(props: AlertProps) {
  const { type, children } = props;

  let classNames = GenericAlertClassNames;
  let specificClassNames = "";
  switch (type) {
    case "success":
      specificClassNames = ["border-green-800 bg-green-500"].join(" ");
      break;
    case "fail":
      specificClassNames = ["border-red-800 bg-red-500"].join(" ");
      break;
  }

  classNames = GenericAlertClassNames + " " + specificClassNames;

  return <div className={classNames}>{children}</div>;
}
