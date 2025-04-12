export function isKanbanState(state: any): state is KanbanState {
  return (state as KanbanState).columns !== undefined;
}
