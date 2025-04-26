import DebugData from "@/shared/DebugData";
import { Card } from "./Card";

import CardActions from "./CardControls";

export default function CardColumn(props: {
  colData: ColData;
  debug?: boolean;
}) {
  const { colData, debug } = props;
  return (
    <div
      className={`bg-neutral-300 dark:bg-neutral-800 pt-1 px-5 pb-15 rounded-2xl space-y-2 shadow-lg`}
    >
      <div className="h-fit">
        <h3 className="text-2xl">{colData.name}</h3>
      </div>
      {colData.cards && <CardList cards={colData.cards} isDebug={debug} />}
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
