/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { QItem } from '../question-items/QItem';

interface DraggableQItemProps {
  leftIcon: any;
  heading: string;
  description: string;
  isClone?: boolean;
}

const QuestionTypeZone = ({
  leftIcon,
  heading,
  description,
}: DraggableQItemProps) => {
  return (
    <div>
      <QItem leftIcon={leftIcon} heading={heading} description={description} />
    </div>
  );
};

export default QuestionTypeZone;
