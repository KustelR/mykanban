import DebugData from "@/shared/DebugData";
import { Card } from "./Card";

import CardActions from "./CardControls";
import { ReactNode, useState } from "react";
import { useAppStore } from "@/lib/hooks";

export default function CardColumn(props: {
  colData: ColData;
  debug?: boolean;
  children?: ReactNode;
  className?: string;
}) {
  const { colData, debug, children, className } = props;
  return (
    <div
      className={`bg-neutral-300 max-h-full dark:bg-neutral-800 pb-5 flex flex-col *:px-5 pt-1 rounded-2xl space-y-2 shadow-lg ${className}`}
    >
      <div>
        <h3 className="text-2xl">{colData.name}</h3>
      </div>
      <div className="space-y-2 overflow-y-auto h-full">
        {colData.cards && <CardList cards={colData.cards} isDebug={debug} />}
        {children}
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
