import DebugData from "@/shared/DebugData";
import TagList from "./TagList";

type CardProps = {
  cardData: CardData;
  debug?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export function Card(props: CardProps) {
  const { cardData, debug, onClick } = props;
  return (
    <>
      <div onClick={onClick}>
        <section className="rounded-xl bg-white hover:bg-neutral-200 dark:bg-[#2f2f2f] dark:hover:bg-neutral-700 p-2 shadow-md">
          <header className="text-xl text-neutral-500 dark:text-neutral-200">
            {cardData.name}
          </header>
          <p className="text-black dark:text-neutral-200 text-wrap break-words line-clamp-3">
            {cardData.description}
          </p>
          <TagList tagIds={cardData.tagIds} />
          {debug && (
            <DebugData
              header="card debug data"
              data={new Map().set("order", cardData.order)}
            />
          )}
        </section>
      </div>
    </>
  );
}
