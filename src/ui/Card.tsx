import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import CardEditor, { CardEditorPortal } from "./CardEditor";
import ChangeIcon from "@public/change.svg";
import DeleteIcon from "@public/delete.svg";

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
      className="cursor-pointer hover:bg-neutral-300 border-[1px] dark:border-neutral-700 hover:dark:bg-neutral-800 rounded-md p-2 "
      onClick={() => {
        if (!blocked) setIsRedacting(true);
      }}
    >
      <section className="rounded-md cursor-pointer hover:bg-neutral-300 border-[1px] dark:border-neutral-700 hover:dark:bg-neutral-800 p-2 ">
        <header className="font-bold">{title}</header>
      <p className="text-wrap break-words line-clamp-3">{description}</p>
        <ul className="flex flex-wrap *:rounded-md *:bg-cyan-700/20 *:mr-1 *:mb-1 *:px-1 *:border-[1px] *:border-cyan-600/30">
          {tags?.map((tag, idx) => {
            return <li key={idx}>{tag}</li>;
          })}
        </ul>
      </section>
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
