// store/questionEditor.ts
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export type EditorOption = {
  id: string;
  text: string;
  isCorrect?: boolean;
};

export type QuestionState = {
  q_id: string;
  questionText: string;
  points: number;
  options?: EditorOption[];
  answer?: number | string;
  error_tolerance?: number;
};

export type QuestionType =
  | 'MultipleChoice'
  | 'MultipleSelect'
  | 'TrueFalse'
  | 'FillBlank'
  | 'Matching'
  | 'Numeric'
  | 'Ordering';

type QuestionStore = {
  MultipleChoice: QuestionState;
  MultipleSelect: QuestionState;
  TrueFalse: QuestionState;
  FillBlank: QuestionState;
  Matching: QuestionState;
  Numeric: QuestionState;
  Ordering: QuestionState;

  getQuestion: (questionType: QuestionType) => QuestionState;
};

// Helper function to create default question state
const createDefaultQuestion = (type: QuestionType): QuestionState => {
  // Add type-specific options
  switch (type) {
    case 'MultipleChoice':
      return {
        q_id: type,
        questionText: '',
        points: 1,
        options: [
          { id: uuid(), text: 'Option 1', isCorrect: true },
          { id: uuid(), text: 'Option 2', isCorrect: false },
        ],
      };
    case 'MultipleSelect':
      return {
        q_id: type,
        questionText: '',
        points: 1,
        options: [
          { id: uuid(), text: 'Option 1', isCorrect: true },
          { id: uuid(), text: 'Option 2', isCorrect: false },
        ],
      };
    case 'TrueFalse':
      return {
        q_id: type,
        questionText: '',
        points: 1,
        options: [
          { id: uuid(), text: 'True', isCorrect: true },
          { id: uuid(), text: 'False', isCorrect: false },
        ],
      };
    case 'FillBlank':
      return {
        q_id: type,
        questionText: '',
        points: 1,
        answer: 'Answer',
      };

    case 'Numeric':
      return {
        q_id: type,
        questionText: '',
        points: 1,
        answer: 200,
        error_tolerance: 1,
      };
    case 'Ordering':
      return {
        q_id: type,
        questionText: '',
        points: 1,
        options: [
          { id: uuid(), text: 'Option 1' },
          { id: uuid(), text: 'Option 2' },
        ],
      };

    default:
      return {
        q_id: type,
        questionText: '',
        points: 1,
        options: [
          { id: uuid(), text: 'Option 1', isCorrect: true },
          { id: uuid(), text: 'Option 2', isCorrect: false },
        ],
      };
  }
};

export const useQuestionStore = create<QuestionStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        MultipleChoice: createDefaultQuestion('MultipleChoice'),
        MultipleSelect: createDefaultQuestion('MultipleSelect'),
        TrueFalse: createDefaultQuestion('TrueFalse'),
        FillBlank: createDefaultQuestion('FillBlank'),
        Matching: createDefaultQuestion('Matching'),
        Numeric: createDefaultQuestion('Numeric'),
        Ordering: createDefaultQuestion('Ordering'),

        getQuestion: (questionType) => {
          const state = get();
          return state[questionType];
        },
      })),
      {
        name: 'fixed-question-store',
      }
    )
  )
);
