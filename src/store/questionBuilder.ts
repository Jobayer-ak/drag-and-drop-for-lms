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

      addDroppedItem: (item) => {
        // const exists = get().droppedItems.find((q) => q.id === item.id);

        set((state) => {
          state.droppedItems.push({
            ...item,
            uid: uuidv4(),
            data: {}, // initialize empty data
          });
        });
        return true;
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
