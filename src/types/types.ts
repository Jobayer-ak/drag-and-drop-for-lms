import React from 'react';

export type QuestionType =
  | 'MultipleChoice'
  | 'MultipleSelect'
  | 'Matching'
  | 'FillBlank'
  | 'TrueFalse'
  | 'Numeric'
  | 'Ordering';

export interface DroppedQuestion {
  uid: string; // use stable uid, e.g., 'MultipleChoice'
  type: QuestionType;
}

export interface DroppedContainerProps {
  dropped: DroppedQuestion[];
  setDropped: React.Dispatch<React.SetStateAction<DroppedQuestion[]>>;
}

export interface ComponentNameProps {
  uid?: string;
  preview?: boolean;
  dragHandleProps?: any;
  onDelete?: (uid: string) => void;
  onEdit?: (uid: string) => void;
}
