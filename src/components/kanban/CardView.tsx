import Popup from "@/shared/Popup";
import { createPortal } from "react-dom";
import formatDate from "@/shared/formatDate";
import TagList from "./TagList";

export default function CardView(props: { card: CardData; fill?: boolean }) {
  const { card, fill } = props;
  return (
    <article
      className={` overflow-y-scroll overflow-x-hidden ${fill ? "h-screen md:w-3xl lg:w-5xl" : "max-h-5/6"} bg-neutral-200 dark:bg-neutral-800 md:m-0 p-2 space-y-2`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div>
        <div className="rounded-md space-x-3 p-1">
          <h1 className=" text-2xl md:text-6xl font-semibold inline dark:text-neutral-200">
            <strong>{card.name}</strong>
          </h1>
        </div>
      </div>
      <p className=" text-lg md:text-4xl font-pt-serif antialiased text-neutral-700 dark:text-neutral-400 whitespace-pre-wrap">
        {card.description}
      </p>
      <span className="text-sm text-neutral-500">
        by &nbsp;
        <span>{card.createdBy}</span>
        &nbsp;
        <span className="">(updated by {card.updatedBy})</span>
      </span>
      <span className="text-sm space-x-2">
        <span className="flex flex-row *:block">
          <span>{formatDate(card.createdAt)}</span>
          &nbsp;
          <span>({formatDate(card.updatedAt)})</span>
        </span>
      </span>
      <TagList tagIds={card.tagIds} />
    </article>
  );
}

export function CardViewPortal(props: {
  card: CardData;
  setIsVisible: (arg: boolean) => void;
}) {
  const { card, setIsVisible } = props;
  return createPortal(
    <Popup setIsActive={setIsVisible}>
      <CardView card={card} fill></CardView>
    </Popup>,
    document.body,
  );
}
