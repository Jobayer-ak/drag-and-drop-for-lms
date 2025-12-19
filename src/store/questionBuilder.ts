/* eslint-disable @typescript-eslint/no-explicit-any */

import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { QuestionState } from './questionEditor';

export interface QuestionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type?: string | null;
}

export interface DroppedQuestion extends QuestionItem {
  uid: string;
  data?: any;
  type?: string;
}

interface QuestionBuilderStore {
  activeItem: QuestionItem | null;
  droppedItems: DroppedQuestion[];
  selectedUid: string | null;

  // actions
  setActiveItem: (item: QuestionItem | null) => void;
  moveDroppedItemByUid: (fromUid: string, toIndex: number) => void;
  reorderDroppedItems: (item: DroppedQuestion[]) => void;
  addDroppedItem: (
    item: QuestionItem,
    index?: number,
    info?: QuestionState
  ) => any;
  lastDroppedItem: null;
  setLastDroppedItem: (item: DroppedQuestion) => void;
  duplicateDroppedItem: (uid: string) => string | null;
  deleteDroppedItem: (uid: string) => void;
  selectDroppedItem: (uid: string) => void;
  updateDroppedItem: (uid: string, newData: QuestionState) => void;
}

export const useQuestionBuilder = create<QuestionBuilderStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        activeItem: null,
        droppedItems: [],
        selectedUid: null,

        setActiveItem: (item) => {
          set((state) => {
            state.activeItem = item;
          });
        },

        moveDroppedItemByUid: (fromUid, toIndex) => {
          set((state) => {
            const fromIndex = state.droppedItems.findIndex(
              (i) => i.uid === fromUid
            );
            if (fromIndex === -1) return;
            state.droppedItems = arrayMove(
              state.droppedItems,
              fromIndex,
              toIndex
            );
          });
        },

        reorderDroppedItems: (items: DroppedQuestion[]) => {
          set({ droppedItems: items });
        },

        addDroppedItem: (
          item: QuestionItem,
          index?: number,
          info?: QuestionState
        ) => {
          let created: DroppedQuestion | null = null;

          set((state) => {
            const newItem: DroppedQuestion = {
              ...item,
              uid: uuidv4(),
              data: info,
              type: 'sortable-item',
            };

            created = newItem; // store for return

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

          return created;
        },

        lastDroppedItem: null,
        setLastDroppedItem: (item: DroppedQuestion) =>
          set(() => ({ lastDroppedItem: item })),

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
            state.droppedItems = state.droppedItems.filter(
              (q) => q.uid !== uid
            );

            // Clear selectedUid if deleted
            if (state.selectedUid === uid) state.selectedUid = null;

            // Clear lastDroppedItem if deleted
            if (state.lastDroppedItem?.uid === uid)
              state.lastDroppedItem = null;
          });
        },

        selectDroppedItem: (uid) => {
          set((state) => {
            state.selectedUid = uid;
          });
        },

        updateDroppedItem: (uid, newData) => {
          set((state) => {
            const index = state.droppedItems.findIndex(
              (item) => item.uid === uid
            );
            if (index !== -1) {
              state.droppedItems[index].data = {
                ...state.droppedItems[index].data,
                ...newData,
              };
            }
          });
        },
      })),

      {
        name: 'question-builder-storage',
      }
    )
  )
);
