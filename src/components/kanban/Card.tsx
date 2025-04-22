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
        <section className="rounded-md bg-neutral-100 hover:bg-neutral-300 border-[1px] dark:bg-neutral-900 dark:border-neutral-700 dark:hover:bg-neutral-800 p-2 ">
          <header className="font-bold overflow-hidden line-clamp-3 break-words max-w-[200px] dark:text-neutral-300">
            {cardData.name}
          </header>
          <p className="text-wrap break-words line-clamp-3 dark:text-neutral-500">
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
