/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { QItem } from '../question-items/QItem';

interface DragPreviewProps {
  leftIcon: any;
  heading: string;
  description: string;
}

export default function DragPreview({
  leftIcon,
  heading,
  description,
}: DragPreviewProps) {
  return (
    <div>
      <QItem
        leftIcon={leftIcon}
        heading={heading}
        description={description}
        className="border border-gray-200 px-4"
      />
    </div>
  );
}
