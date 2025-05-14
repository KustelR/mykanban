import DebugData from "@/shared/DebugData";
import { Card } from "./Card";

import CardActions from "./CardControls";
import { ReactNode, useState } from "react";
import { useAppStore } from "@/lib/hooks";
import DotsHorizontal from "@public/dots-horizontal.svg";
import PlusIcon from "@public/plus.svg";

interface Options {
  onEdit?: () => void;
  onLeft?: () => void;
  onAdd?: () => void;
  onRight?: () => void;
  onDelete?: () => void;
}

export default function CardColumn(props: {
  colData: ColData;
  debug?: boolean;
  children?: ReactNode;
  className?: string;
  options?: Options;
}) {
  const { colData, debug, className, options } = props;
  return (
    <>
      <div
        className={`bg-neutral-300 max-h-full dark:bg-neutral-800 pb-5 flex flex-col *:px-5 pt-1 rounded-2xl space-y-2 hover:[&_button]:flex shadow-lg ${className}`}
      >
        <div className="flex flex-row justify-between">
          <h3 className="text-2xl">{colData.name}</h3>
          <ColumnOptions options={options} />
        </div>
        <div className="space-y-2 overflow-y-auto h-full">
          {colData.cards && <CardList cards={colData.cards} isDebug={debug} />}
          {options?.onAdd && <AddCardButton onAdd={options.onAdd} />}
        </div>
        {debug && (
          <DebugData
            header="column debug data"
            data={new Map()
              .set("order", colData.order)
              .set("cards", colData.cards ? colData.cards.length : 0)}
          />
        )}
      </div>
    </>
  );
}

function ColumnOptions(props: { options?: Options }) {
  const { options } = props;
  if (!options) return null;

  const [isClicked, setIsClicked] = useState(false);

  return (
    <button
      aria-label="Column options"
      className="hidden relative hover:**:fill-neutral-700"
    >
      <DotsHorizontal
        onClick={() => {
          setIsClicked(!isClicked);
        }}
      />
      {isClicked && (
        <div className="absolute -right-28 bg-neutral-100 dark:bg-neutral-700 rounded-md px-2 z-10">
          <ul>{options.onEdit && <li onClick={options.onEdit}>Edit</li>}</ul>
          <ul>
            {options.onLeft && <li onClick={options.onLeft}>Move Left</li>}
          </ul>
          <ul>
            {options.onRight && <li onClick={options.onRight}>Move Right</li>}
          </ul>
          <ul>
            {options.onDelete && <li onClick={options.onDelete}>Delete</li>}
          </ul>
        </div>
      )}
    </button>
  );
}

function CardList(props: { cards: CardData[]; isDebug?: boolean }) {
  const { cards, isDebug } = props;

  const store = useAppStore();
  store.subscribe(() => {
    setFilter(new RegExp(store.getState().settings.filterRegex));
  });
  const [filter, setFilter] = useState<RegExp | undefined>();

  return (
    <ol className=" space-y-2">
      {[...cards]
        .filter((card) => {
          const filterText = [card.name, card.description].join(" ");
          return filter ? filter.test(filterText) : true;
        })
        .sort((card1, card2) => {
          return card1.order - card2.order;
        })
        .map((card) => {
          return (
            <li key={card.id}>
              <CardActions cardData={card}>
                <Card debug={isDebug} cardData={card} />
              </CardActions>
            </li>
          );
        })}
    </ol>
  );
}
function AddCardButton(props: { onAdd: (arg: boolean) => void }) {
  const { onAdd: setIsAdding } = props;
  return (
    <button
      onClick={(e) => {
        setIsAdding(true);
      }}
      className="cursor-pointer flex flex-row space-x-2 w-full"
    >
      <PlusIcon
        className="*:fill-neutral-600 dark:*:fill-neutral-400"
        width={20}
        height={20}
      />{" "}
      <div>Add new card</div>
    </button>
  );
}
