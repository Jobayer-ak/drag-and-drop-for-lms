/* eslint-disable @typescript-eslint/no-explicit-any */
// /store/questionBuilder.ts
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

export interface QuestionItem {
  id: string; // type of question: MultipleChoice, TrueFalse, etc.
  name: string;
  description: string;
  icon: string;
}

export interface DroppedQuestion extends QuestionItem {
  uid: string; // unique instance id
  data?: any; // for question-specific data (options, selected, points, etc.)
}

interface QuestionBuilderStore {
  activeItem: QuestionItem | null;
  droppedItems: DroppedQuestion[];
  selectedUid: string | null; // currently selected question for editing

  // actions
  setActiveItem: (item: QuestionItem | null) => void;
  addDroppedItem: (item: QuestionItem) => boolean;
  duplicateDroppedItem: (uid: string) => string | null;
  deleteDroppedItem: (uid: string) => void;
  selectDroppedItem: (uid: string) => void;
  updateDroppedItem: (uid: string, newData: Partial<DroppedQuestion>) => void;
}

export const useQuestionBuilder = create<QuestionBuilderStore>()(
  devtools(
    immer((set, get) => ({
      activeItem: null,
      droppedItems: [],
      selectedUid: null,

      setActiveItem: (item) => {
        set((state) => {
          state.activeItem = item;
        });
      },

      addDroppedItem: (item, index?: number) => {
        set((state) => {
          const newItem: DroppedQuestion = { ...item, uid: uuidv4(), data: {} };
          if (
            typeof index === 'number' &&
            index >= 0 &&
            index <= state.droppedItems.length
          ) {
            state.droppedItems.splice(index, 0, newItem);
          } else {
            state.droppedItems.push(newItem);
          }
        });
        return true;
      },

      duplicateDroppedItem: (uid) => {
        let newUid: string | null = null;

        set((state) => {
          const index = state.droppedItems.findIndex((q) => q.uid === uid);
          if (index === -1) return;

          const original = state.droppedItems[index];

          const duplicated: DroppedQuestion = {
            ...original,
            uid: uuidv4(),
            data: { ...original.data },
          };

          newUid = duplicated.uid;

          state.droppedItems.splice(index + 1, 0, duplicated);
          state.selectedUid = duplicated.uid;
        });

        return newUid;
      },

      deleteDroppedItem: (uid) => {
        set((state) => {
          state.droppedItems = state.droppedItems.filter((q) => q.uid !== uid);
          if (state.selectedUid === uid) state.selectedUid = null;
        });
      },

      selectDroppedItem: (uid) => {
        set((state) => {
          state.selectedUid = uid;
        });
      },

      updateDroppedItem: (uid, newData) => {
        set((state) => {
          const index = state.droppedItems.findIndex((q) => q.uid === uid);
          if (index !== -1) {
            state.droppedItems[index] = {
              ...state.droppedItems[index],
              ...newData,
            };
          }
        });
      },
    }))
  )
);
