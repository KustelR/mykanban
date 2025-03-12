import { Card } from "./Card";

import CardActions from "./CardControls";

export default function CardColumn(props: {
  colData: ColData;
  debug?: boolean;
}) {
  const { colData, debug } = props;
  return (
    <div className={`px-1 space-y-2`}>
      <div className="relative h-fit">
        <h3 className="text-xl font-semibold bg-cyan-700/30 rounded-md px-2">
          {colData.name}
        </h3>
      </div>
      <ol className="w-full space-y-2">
        {colData.cards &&
          [...colData.cards]
            .sort((card1, card2) => {
              return card1.order - card2.order;
            })
            .map((card) => {
              return (
                <li key={card.id}>
                  <CardActions cardData={card}>
                    <Card debug={debug} cardData={card} />
                  </CardActions>
                </li>
              );
            })}
      </ol>
      {debug && (
        <div className="rounded-md bg-red-600/30 p-1">
          <strong>debug data</strong>
          <ul>
            <li>order: {colData.order}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
