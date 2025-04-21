import * as React from "react";

export interface AlertProps {
  type: "success" | "fail" | "warning";
  children: React.ReactNode;
}

const genericAlertClassNames =
  "border-4 rounded-lg p-2 m-2 z-10 w-full flex items-center";

export function Alert(props: AlertProps) {
  const { type, children } = props;

  let classNames = genericAlertClassNames;
  let specificClassNames = "";
  switch (type) {
    case "success":
      specificClassNames = ["border-green-500 bg-green-800"].join(" ");
      break;
    case "fail":
      specificClassNames = ["border-red-500 bg-red-800"].join(" ");
      break;
    case "warning":
      specificClassNames = ["border-yellow-500 bg-yellow-800"].join(" ");
      break;
  }

  classNames = [genericAlertClassNames, specificClassNames].join(" ");

  return <div className={classNames}>{children}</div>;
}
