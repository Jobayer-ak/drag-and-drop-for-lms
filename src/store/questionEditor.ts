import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type EditorOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

type QuestionState = {
  q_id: string;
  questionText: string;
  points: number;
  options: EditorOption[];
};

type QuestionStore = {
  MultipleChoice: QuestionState;
  updateMultipleChoice: (updates: Partial<QuestionState>) => void;
  // question2?: QuestionState;
  // question3?: QuestionState;
  // question4?: QuestionState;
  // question5?: QuestionState;
  // question6?: QuestionState;
  // question7?: QuestionState;
};

export const useQuestionStore = create<QuestionStore>()(
  devtools(
    persist(
      immer((set) => ({
        MultipleChoice: {
          q_id: 'MultipleChoice',
          questionText: '',
          points: 1,
          options: [
            { id: uuid(), text: 'Option 1', isCorrect: true },
            { id: uuid(), text: 'Option 2', isCorrect: false },
          ],
        },
        updateMultipleChoice: (updates) =>
          set((state) => {
            // Merge updates into MultipleChoice state
            Object.assign(state.MultipleChoice, updates);
          }),
      })),
      { name: 'fixed-question-store' }
    )
  )
);
