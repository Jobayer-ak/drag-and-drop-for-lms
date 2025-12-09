'use client';

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useState } from 'react';
import DraggableQuestions from '../components/draggable/DraggableQuestions';
import DropZoneContainer from '../components/drop-zone/DropZoneContainer';
import EditZoneContainer from '../components/edit-zone/EditZoneContainer';
import DragPreview from '../components/preview/DragPreview';
import { ICON_MAP } from '../components/question-items/QItem';
import { showSuccess } from '../lib/toastHelper';
import { useQuestionBuilder } from '../store/questionBuilder';

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

  const { activeItem, setActiveItem, addDroppedItem, droppedItems } =
    useQuestionBuilder();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const id = event.active.id;
    const found = items.find((i) => i.id === id);
    setActiveItem(found ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;

    if (!over || !activeItem) {
      setActiveItem(null);
      return;
    }

    const overId = String(over.id);

    if (overId.startsWith('slot-')) {
      // Insert into highlighted gap
      const index = Number(overId.split('-')[1]);
      addDroppedItem(activeItem, index);
      showSuccess(`${activeItem.name} question added successfully!`);
    } else if (overId === 'DROP_ZONE') {
      // fallback: drop at end if drop zone empty
      addDroppedItem(activeItem);
      showSuccess(`${activeItem.name} question added successfully!`);
    }

    setActiveItem(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // prevent accidental drags
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
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
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
