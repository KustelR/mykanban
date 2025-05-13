import { useAppDispatch, useAppStore } from "@/lib/hooks";
import TextInput from "@/shared/TextInput";
import TagEditor from "@/components/kanban/editors/TagEditor";

import DeleteIcon from "@public/delete.svg";
import PlusIcon from "@public/plus.svg";
import { createTag, newTag } from "@/scripts/kanban";

export function CardDataEditor(props: {
  card: CardData;
  setCard: (arg: CardData) => void;
  pushTagId: (arg: string) => void;
  removeTagId: (arg: string) => void;
}) {
  const { card, setCard, pushTagId, removeTagId } = props;
  const store = useAppStore();
  const dispatch = useAppDispatch();

  return (
    <div className="max-w-full">
      <header className="font-bold">Editor</header>
      <form action="" onSubmit={(e) => e.preventDefault()}>
        <TextInput
          defaultValue={card.name}
          onChange={(e) => {
            setCard({ ...card, name: e.target.value });
          }}
          id="cardCreator_name"
          label="Name"
        />
        <TextInput
          area
          defaultValue={card.description}
          onChange={(e) => {
            setCard({ ...card, description: e.target.value });
          }}
          id="cardCreator_description"
          label="Description"
        />
      </form>
      <TagEditor
        options={getTagEditorOptions(pushTagId, removeTagId, card, setCard)}
        onTagCreation={async (name, color) => {
          const kanban = store.getState().kanban;
          tagCreationHandler(
            dispatch,
            kanban.id,
            kanban.tags ? kanban.tags : [],
            name,
            color,
            card,
            setCard,
            pushTagId,
          );
        }}
      ></TagEditor>
    </div>
  );
}

function getTagEditorOptions(
  pushNewTagId: (arg: string) => void,
  removeTagId: (arg: string) => void,
  card: CardData,
  setCard: (arg: CardData) => void,
) {
  return [
    {
      icon: DeleteIcon,
      className: "bg-red-800 hover:bg-red-900",
      label: "Delete tag",
      condition: (tag: TagData) => {
        return card.tagIds.includes(tag.id);
      },
      callback: (tag: TagData) => {
        const data = card.tagIds.filter((t) => t !== tag.id);
        setCard({ ...card, tagIds: data });
        removeTagId(tag.id);
      },
    },
    {
      icon: PlusIcon,
      className: "bg-green-800 hover:bg-green-900",
      label: "Add tag",
      condition: (tag: TagData) => {
        return !card.tagIds.includes(tag.id);
      },
      callback: (tag: TagData) => {
        setCard({ ...card, tagIds: card.tagIds.concat(tag.id) });
        pushNewTagId(tag.id);
      },
    },
  ];
}

async function tagCreationHandler(
  dispatch: AppDispatch,
  projectId: string,
  tags: TagData[],
  name: string,
  color: string,
  card: CardData,
  setCard: (arg: CardData) => void,
  pushNewTagId: (arg: string) => void,
) {
  const t = await createTag(
    tags ? tags : [],
    newTag(name, color),
    dispatch,
    projectId,
  );
  setCard({ ...card, tagIds: card.tagIds.concat(t.id) });
  pushNewTagId(t.id);
}
