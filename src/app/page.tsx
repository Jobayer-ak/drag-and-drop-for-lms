'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useEffect, useState } from 'react';
import DraggableQuestions from '../components/draggable/DraggableQuestions';
import DropZoneContainer from '../components/drop-zone/DropZoneContainer';
import EditZoneContainer from '../components/edit-zone/EditZoneContainer';
import DragPreview from '../components/preview/DragPreview';
import { ICON_MAP } from '../components/question-items/QItem';
import SortingPreview from '../components/sortable/SortingPreview';
import { showSuccess } from '../lib/toastHelper';
import { DroppedQuestion, useQuestionBuilder } from '../store/questionBuilder';

const items = [
  {
    id: 'MultipleChoice',
    name: 'Multiple Choice',
    description: 'Single correct answer from multiple options',
    icon: 'FaCircleDot',
  },
  {
    id: 'MultipleSelect',
    name: 'Multiple Select',
    description: 'Multiple correct answers from options',
    icon: 'BiSolidSelectMultiple',
  },
  {
    id: 'TrueFalse',
    name: 'True/False',
    description: 'Binary choice question',
    icon: 'BsListCheck',
  },
  {
    id: 'FillBlank',
    name: 'Fill in the Blank',
    description: 'Complete missing text in a sentence',
    icon: 'PiAlignBottomFill',
  },
  {
    id: 'Matching',
    name: 'Matching',
    description: 'Match items from two columns',
    icon: 'PiLinkSimpleFill',
  },
  {
    id: 'Numeric',
    name: 'Numeric Entry',
    description: 'Number input with tolerance',
    icon: 'GoNumber',
  },
  {
    id: 'Ordering',
    name: 'Ordering Sequence',
    description: 'Arrange items in correct order',
    icon: 'FaBarsStaggered',
  },
];

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);

  const [sortAcitveDrag, setSortActiveDrag] = useState<string | null>(null);

  const {
    activeItem,
    setActiveItem,
    addDroppedItem,
    droppedItems,
    setLastDroppedItem,
    moveDroppedItemByUid,
  } = useQuestionBuilder();

  useEffect(() => {
    setMounted(true);
  }, []);

  // console.log('current active item: ', activeItem);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;

    console.log('event afsafasd: ', active);

    if (type === 'sortable-item') {
      // This is an already dropped item being dragged
      setSortActiveDrag(String(active?.id));
      setActiveItem(null); // no activeItem from left panel
    } else {
      // This is a new item from the left palette
      const found = items.find((i) => i.id === active.id);
      setActiveItem(found ?? null);
      setSortActiveDrag(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    //Reorder existing items
    if (active.data.current?.type === 'sortable-item') {
      const fromUid = activeId;
      const newIndex = droppedItems.findIndex((i) => i.uid === overId);

      if (newIndex !== -1) {
        moveDroppedItemByUid(fromUid, newIndex);
      }
      return;
    }

    let newItem: DroppedQuestion | null = null;

    // Add new item from the left palette
    if (activeItem) {
      if (overId.startsWith('slot-')) {
        const index = Number(overId.split('-')[1]);
        newItem = addDroppedItem(activeItem, index);
        console.log('new iem: ', newItem);
      } else if (overId === 'DROP_ZONE') {
        newItem = addDroppedItem(activeItem);
      }

      showSuccess(`${activeItem.name} question added successfully!`);
    }

    // 2. Store the last dropped item

    if (newItem) setLastDroppedItem(newItem);

    setActiveItem(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // prevent accidental drags
      },
    })
  );

  console.log('again tyep: ', sortAcitveDrag);

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={sortAcitveDrag ? [restrictToVerticalAxis] : []}
    >
      <div className="min-h-screen overflow-hidden bg-white flex flex-row gap-12 px-8 py-4">
        {/* Left palette */}
        <aside className="basis-sm rounded-md min-h-screen overflow-y-auto hide-scrollbar">
          <h3 className="bg-gray-200 text-gray-700 text-center py-4 text-lg font-semibold">
            Form Elements
          </h3>
          {mounted &&
            items.map((item) => (
              <div key={item.id}>
                <DraggableQuestions
                  id={item.id}
                  leftIcon={ICON_MAP[item.icon]}
                  heading={item.name}
                  description={item.description}
                />
              </div>
            ))}
        </aside>

        {/* Drop Zone */}
        <main className="basis-2xl min-h-screen overflow-y-auto hide-scrollbar">
          <DropZoneContainer />
        </main>

        {/* Right edit panel */}
        <aside className="basis-sm border border-gray-200 min-h-screen overflow-y-auto hide-scrollbar">
          <EditZoneContainer />
        </aside>

        {/* Drag preview overlay */}
        <DragOverlay>
          {activeItem ? (
            <DragPreview
              leftIcon={ICON_MAP[activeItem.icon]}
              heading={activeItem.name}
              description={activeItem.description}
            />
          ) : (
            sortAcitveDrag && <SortingPreview previewId={sortAcitveDrag} />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
