import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CardEditor, { CardEditorPortal } from "./CardEditor";
import { useAppDispatch } from "@/lib/hooks";
import { replaceCardAction } from "@/lib/features/kanban/kanbanSlice";

type CardProps = {
  cardData: CardData;
  blocked?: boolean;
  cards?: Array<CardData>;
  setCards?: (arg: Array<CardData>) => void;
};

export function Card(props: CardProps) {
  const { cardData, blocked, cards, setCards } = props;
  const { title, description, tags } = cardData;
  const [isRedacting, setIsRedacting] = useState(false);
  const dispatch = useAppDispatch();

  return (
    <div
      className="cursor-pointer bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800  hover:dark:bg-neutral-700 rounded-md p-2 w-full"
      onClick={() => {
        if (!blocked) setIsRedacting(true);
      }}
    >
      <h4 className="font-bold">{title}</h4>
      <p className="text-wrap break-words line-clamp-3">{description}</p>
      <div>
        <ul className="flex flex-wrap *:rounded-md *:bg-cyan-700/20 *:mr-1 *:mb-1 *:px-1 *:border-[1px] *:border-cyan-600/30">
          {tags?.map((tag, idx) => {
            return <li key={idx}>{tag}</li>;
          })}
        </ul>
      </div>
      {isRedacting && (
        <CardEditorPortal
          cardData={cardData}
          setCardData={(card) => {
            if (cards && setCards) {
              const cardIdx = cards.findIndex((card2) => {
                return card2.id === card.id;
              });
              const newCards = [...cards];
              newCards[cardIdx] = card;
              setCards(newCards);
            }
          }}
          blocked={blocked}
          isRedacting={isRedacting}
          setIsRedacting={setIsRedacting}
        />
      )}
    </div>
  );
}
