import { Card } from "./Card";

export default function CardColumn(props: {
  header: string;
  className?: string;
  cards: Array<CardData>;
}) {
  const { header, cards, className } = props;
  return (
    <div className={` ${className} px-1 space-y-2`}>
      <h3 className="text-xl font-semibold bg-cyan-700/30 rounded-md px-2">
        {header}
      </h3>
      <ol className="w-full h-full space-y-2">
        {cards.map((card, idx) => {
          return (
            <li key={idx}>
              <Card cardData={card} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
