type CardProps = {
  cardData: CardData;
};

export function Card(props: CardProps) {
  const { cardData } = props;
  const { title, description, tags } = cardData;
  return (
    <div className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-800  hover:dark:bg-neutral-700 rounded-xl p-2 w-full">
      <h4 className="font-bold">{title}</h4>
      <p>{description}</p>
      <div>
        <h4>tags</h4>
        <ul className="p-1 inline-flex *:rounded-md *:bg-cyan-700/20 space-x-2 *:px-1 *:border-[1px] *:border-cyan-600/30">
          {tags?.map((tag, idx) => {
            return <li key={idx}>{tag}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}
