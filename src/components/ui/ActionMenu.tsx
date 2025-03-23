import React, { ReactElement, ReactNode } from "react";

type ActionMenuProps = {
  options: Array<{
    icon: (props: {
      width: number;
      height: number;
      className: string;
    }) => ReactNode;
    callback: () => void;
    className?: string;
  }>;
};

export default function ActionMenu(props: ActionMenuProps) {
  const { options } = props;
  return (
    <ul
      className={`overflow-visible flex absolute top-0 right-0 flex-row"`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {options.map((option, idx) => {
        return (
          <li key={idx}>
            <button
              className={`h-5 w-5 flex flex-wrap content-center justify-center ${option.className}`}
              onClick={() => {
                option.callback();
              }}
            >
              {
                <option.icon
                  width={16}
                  height={16}
                  className="*:stroke-white *:fill-transparent"
                />
              }
            </button>
          </li>
        );
      })}
    </ul>
  );
}
