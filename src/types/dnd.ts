export interface DraggableItem {
  id: string;
  content: string;
  [key: string]: any;
}

export interface KanbanTask extends DraggableItem {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
}

export interface KanbanColumn {
  id: string;
  title: string;
  tasks: KanbanTask[];
}
