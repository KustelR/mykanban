import DebugData from "@/shared/DebugData";
import { Card } from "./Card";

import CardActions from "./CardControls";
import { ReactNode } from "react";

export default function CardColumn(props: {
  colData: ColData;
  debug?: boolean;
  children?: ReactNode;
}) {
  const { colData, debug, children } = props;
  return (
    <div
      className={`bg-neutral-300 h-full dark:bg-neutral-800 p-5 pt-1 rounded-2xl space-y-2 shadow-lg`}
    >
      <div className="h-fit">
        <h3 className="text-2xl">{colData.name}</h3>
      </div>
      <div className="overflow-y-scroll space-y-2">
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
  return (
    <ol className="w-full space-y-2">
      {[...cards]
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
