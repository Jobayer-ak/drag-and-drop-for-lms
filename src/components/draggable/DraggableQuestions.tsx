/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useDraggable } from '@dnd-kit/core';
import { QItem } from '../question-items/QItem';

interface DraggableQItemProps {
  leftIcon: any;
  heading: string;
  description: string;
  isClone?: boolean;
  id: string;
}

const DraggableQuestions = ({
  leftIcon,
  heading,
  description,
  id,
}: DraggableQItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    isDragging,
    active,

    over,
  } = useDraggable({
    id, // Unique random ID
  });

  // const id = useMemo(() => uuidv4(), []);

  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <QItem
        leftIcon={leftIcon}
        heading={heading}
        description={description}
        className={`transition-opacity duration-200 ${
          isDragging ? 'opacity-40' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default DraggableQuestions;
