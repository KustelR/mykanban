import Popup from "@/shared/Popup";
import { createPortal } from "react-dom";
import formatDate from "@/shared/formatDate";
import TagList from "./TagList";

export default function CardView(props: { card: CardData }) {
  const { card } = props;
  return (
    <section
      className="md:w-3xl overflow-y-scroll md:min-h-[500px] md:max-h-[800px] bg-neutral-100 dark:bg-neutral-900 border-[1px] md:m-0 md:max-w-[800px] border-neutral-600 p-2 rounded-md space-y-2"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div>
        <div className="rounded-md space-x-3 p-1">
          <h1 className=" text-xl font-semibold inline dark:text-neutral-200">
            <strong>{card.name}</strong>
          </h1>
          <span className="text-sm space-x-2">
            <span className="flex flex-row *:block">
              <span>{formatDate(card.createdAt)}</span>
              &nbsp;
              <span>({formatDate(card.updatedAt)})</span>
            </span>
          </span>
        </div>
        <span className="text-sm text-neutral-500">
          by &nbsp;
          <span>{card.createdBy}</span>
          &nbsp;
          <span className="">(updated by {card.updatedBy})</span>
        </span>
      </div>
      <p className=" text-lg font-serif dark:text-neutral-300">
        {card.description}
      </p>
      <TagList tagIds={card.tagIds} />
    </section>
  );
}

export function CardViewPortal(props: {
  card: CardData;
  setIsVisible: (arg: boolean) => void;
}) {
  const { card, setIsVisible } = props;
  return createPortal(
    <Popup setIsActive={setIsVisible}>
      <CardView card={card}></CardView>
    </Popup>,
    document.body,
  );
}
