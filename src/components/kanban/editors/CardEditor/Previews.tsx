import { Card } from "@/components/kanban/Card";
import CardView from "@/components/kanban/CardView";

export function CardPreview(props: { card: CardData }) {
  const { card } = props;
  return (
    <div className="w-full">
      <Card cardData={{ ...card }}></Card>
    </div>
  );
}
export function CardViewPreview(props: { card: CardData }) {
  const { card } = props;
  return (
    <div className="flex w-screen md:w-fit flex-col md:flex-row md:space-x-2 space-y-2">
      <div className="max-h-screen md:w-fit">
        <CardView card={card} />
      </div>
    </div>
  );
}
