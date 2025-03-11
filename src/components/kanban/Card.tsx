import { useDrag } from "react-dnd";
import { ItemTypes } from "@/Constants";
import TagList from "./TagList";

type CardProps = {
  cardData: CardData;
  debug?: boolean;
};

export function Card(props: CardProps) {
  const { cardData, debug } = props;
  const { name, description, tagIds: tags } = cardData;

  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: cardData,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <>
      {drag(
        <div
          className={`${isDragging ? "cursor-move" : "cursor-pointer"} size-fit relative w-full`}
        >
          <section className="rounded-md hover:bg-neutral-300 border-[1px] dark:border-neutral-700 hover:dark:bg-neutral-800 p-2 ">
            <header className="font-bold overflow-hidden line-clamp-3 break-words max-w-[200px]">
              {name}
            </header>
            <p className="text-wrap break-words line-clamp-3">{description}</p>
            <TagList tagIds={tags} />
            {debug && (
              <div className="bg-red-600/30 rounded-md p-1">
                <strong>debug data</strong>
                <ul>
                  <li>order: {cardData.order}</li>
                </ul>
              </div>
            )}
          </section>
        </div>,
      )}
    </>
  );
}
