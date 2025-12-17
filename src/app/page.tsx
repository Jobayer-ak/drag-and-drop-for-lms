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
import { useEffect, useRef, useState } from 'react';
import DraggableQuestions from '../components/draggable/DraggableQuestions';
import DropZoneContainer from '../components/drop-zone/DropZoneContainer';
import EditZoneContainer from '../components/edit-zone/EditZoneContainer';
import DragPreview from '../components/preview/DragPreview';
import { ICON_MAP } from '../components/question-items/QItem';
import SortingPreview from '../components/sortable/SortingPreview';
import { showSuccess } from '../lib/toastHelper';
import { useQuestionBuilder } from '../store/questionBuilder';
import { QuestionType, useQuestionStore } from '../store/questionEditor';

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
  {
    id: 'ShortAnswer',
    name: 'Short Answer/Free Text',
    description: '2-3 sentence response',
    icon: 'FaClipboardCheck',
  },
  {
    id: 'LongAnswer',
    name: 'Essay/Long Answer',
    description: 'Extended write response',
    icon: 'HiMenuAlt1',
  },
  {
    id: 'FileUpload',
    name: 'File Upload',
    description: 'Student uploads a file',
    icon: 'FaImage',
  },
];
const questionsName = [
  'MultipleChoice',
  'MultipleSelect',
  'TrueFalse',
  'FillBlank',
  'Matching',
  'Numeric',
  'Ordering',
  'ShortAnswer',
  'LongAnswer',
];

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null); // NEW: shared DropZone ref

  const [sortAcitveDrag, setSortActiveDrag] = useState<string | null>(null);

  const {
    activeItem,
    setActiveItem,
    addDroppedItem,
    droppedItems,
    setLastDroppedItem,
    moveDroppedItemByUid,
  } = useQuestionBuilder();

  const { getQuestion } = useQuestionStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const type = active.data.current?.type;
    console.log('type: ', type);

    if (type === 'sortable-item') {
      setSortActiveDrag(String(active?.id));
      setActiveItem(null);
    } else {
      const found = items.find((i) => i.id === active.id);
      setActiveItem(found ?? null);
      setSortActiveDrag(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Compute actual drop pointer coordinates (best-effort):
    const computeDropPoint = (): { x: number; y: number } | null => {
      // 1) Prefer using activatorEvent + delta (most reliable)
      try {
        const activator = event.activatorEvent as
          | PointerEvent
          | TouchEvent
          | undefined;
        const dx = event.delta?.x ?? 0;
        const dy = event.delta?.y ?? 0;

        if (activator) {
          // PointerEvent (mouse / pointer)
          if ('clientX' in activator && typeof activator.clientX === 'number') {
            return {
              x: activator.clientX + dx,
              y: activator.clientY + dy,
            };
          }

          // TouchEvent (mobile): use first touch if available
          if ('touches' in activator && activator.touches?.[0]) {
            const touch = activator.touches[0];
            return {
              x: touch.clientX + dx,
              y: touch.clientY + dy,
            };
          }

          // For older event shapes, try changedTouches
          if ('changedTouches' in activator && activator.changedTouches?.[0]) {
            const touch = activator.changedTouches[0];
            return {
              x: touch.clientX + dx,
              y: touch.clientY + dy,
            };
          }
        }
      } catch (e) {
        // ignore and fallback
      }

      // 2) Fallback: use over.rect center if available
      if (over && (over as any).rect) {
        const r = (over as any).rect;
        // rect has x,y,width,height — use center as pointer pos
        const cx =
          typeof r.x === 'number'
            ? r.x + (r.width ? r.width / 2 : 0)
            : r.left + (r.width ? r.width / 2 : 0);
        const cy =
          typeof r.y === 'number'
            ? r.y + (r.height ? r.height / 2 : 0)
            : r.top + (r.height ? r.height / 2 : 0);
        return { x: cx, y: cy };
      }

      // 3) last resort: null
      return null;
    };

    const dropPoint = computeDropPoint();

    // If we couldn't compute drop point, safely cancel (or allow by over presence — choose cancel)
    if (!dropPoint) {
      // Optional: if you want to allow drops when `over` exists even without coordinates, remove this return
      setActiveItem(null);
      return;
    }

    // Check if drop point is inside the DropZone container
    const containerRect = containerRef.current?.getBoundingClientRect();
    const pointerInsideDropZone =
      !!containerRect &&
      dropPoint.x >= containerRect.left &&
      dropPoint.x <= containerRect.right &&
      dropPoint.y >= containerRect.top &&
      dropPoint.y <= containerRect.bottom;

    if (!pointerInsideDropZone) {
      setActiveItem(null);
      return;
    }

    // now safe to use `over`
    if (!over) {
      setActiveItem(null);
      return;
    }

    const activeId = String(active.id);
    const overId = String(over.id);

    // Sorting existing items
    if (active.data.current?.type === 'sortable-item') {
      const newIndex = droppedItems.findIndex((i) => i.uid === overId);
      if (newIndex !== -1) moveDroppedItemByUid(activeId, newIndex);
      return;
    }

    // Add new item (only when dropping onto a slot)
    if (activeItem && overId.startsWith('slot-')) {
      const index = Number(overId.split('-')[1]);
      const q = getQuestion(activeItem.id as QuestionType);

      const newItem = addDroppedItem(activeItem, index, q);
      setLastDroppedItem(newItem);

      showSuccess(`${activeItem.name} added successfully!`);
    }

    setActiveItem(null);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
        delay: 100,
        tolerance: 5,
      },
    })
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCenter}
      modifiers={sortAcitveDrag ? [restrictToVerticalAxis] : []}
    >
      <div className="min-h-screen overflow-hidden bg-white flex flex-row gap-12 px-8 py-4">
        {/* Left Panel */}
        <aside className="basis-2xl rounded-md h-screen overflow-y-auto overflow-hidden hide-scrollbar">
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
        <main className="w-full h-screen overflow-hidden overflow-y-auto hide-scrollbar">
          <DropZoneContainer containerRef={containerRef} />
        </main>

        {/* Right Panel */}
        <aside className="basis-4xl border border-gray-200 h-screen overflow-y-auto hide-scrollbar">
          <EditZoneContainer />
        </aside>

        {/* Drag Preview */}
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
