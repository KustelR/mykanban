import { useState } from "react";
import { createPortal } from "react-dom";
import CardEditor from "./CardEditor";

type CardProps = {
  cardData: CardData;
  blocked?: boolean;
};

export function Card(props: CardProps) {
  const { cardData, blocked } = props;
  const { title, description, tags } = cardData;
  const [isRedacting, setIsRedacting] = useState(false);

  const Portal = () =>
    createPortal(
      <div
        onClick={(e) => {
          e.stopPropagation();
          if (!blocked) setIsRedacting(!isRedacting);
        }}
        className="absolute left-0 top-0 w-full h-full"
      >
        <CardEditor defaultCard={cardData}></CardEditor>
      </div>,
      document.body,
    );

  return (
    <div
      className="cursor-pointer bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800  hover:dark:bg-neutral-700 rounded-xl p-2 w-full"
      onClick={() => {
        if (!blocked) setIsRedacting(true);
      }}
    >
      <h4 className="font-bold">{title}</h4>
      <p className="text-wrap break-words">{description}</p>
      <div>
        <h4>tags</h4>
        <ul className="flex flex-wrap *:rounded-md *:bg-cyan-700/20 *:mr-1 *:mb-1 *:px-1 *:border-[1px] *:border-cyan-600/30">
          {tags?.map((tag, idx) => {
            return <li key={idx}>{tag}</li>;
          })}
        </ul>
      </div>
      {isRedacting && <Portal />}
    </div>
  );
}
