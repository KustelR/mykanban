import { ReactNode } from "react";

export default function ShowIf(props: {
  isVisible: boolean;
  children?: ReactNode;
}) {
  return <>{props.isVisible ? props.children : ""}</>;
}
