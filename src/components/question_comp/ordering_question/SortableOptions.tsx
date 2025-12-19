'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { MdOutlineDragIndicator } from 'react-icons/md';

interface SortableOptionProps {
  option: any;
  index: number;
  uid?: string;
  optionId?: string;
}

const SortableOptions: React.FC<SortableOptionProps> = ({
  option,
  index,
  uid,
  optionId,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: optionId,
    data: {
      type: 'option',
      parentUid: uid,
      option,
      index,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="ms-1 px-2 border border-gray-200 rounded-[3px] py-1 bg-white"
    >
      <div className="flex items-center gap-3 text-gray-400 py-1">
        <MdOutlineDragIndicator
          className="h-4 w-4 text-gray-400 cursor-move focus-visible:ring-0 focus:outline-none"
          {...attributes}
          {...listeners}
        />
        <span
          className="flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-400 
          text-xs font-medium rounded-full"
        >
          {index + 1}
        </span>
        <p className="text-sm">{option.text}</p>
      </div>
    </div>
  );
};

export default SortableOptions;
