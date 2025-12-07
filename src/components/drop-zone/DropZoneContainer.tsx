'use client';

import { useDroppable } from '@dnd-kit/core';
import { PiArrowsOut } from 'react-icons/pi';
import { useQuestionBuilder } from '../../store/questionBuilder';
import MultipleChoice from '../question_comp/multiple_choice/MultipleChoice';
import { MultipleSelect } from '../question_comp/multiple_select/MultipleSelect';
import NumericEntry from '../question_comp/numeric_entry/NumericEntry';
import OrderingQuestion from '../question_comp/ordering_question/OrderingQuestion';
import TrueFalse from '../question_comp/true_false/TrueFalse';

const DropZoneContainer = () => {
  const { setNodeRef, active, isOver, over } = useDroppable({
    id: 'DROP_ZONE',
  });

  const {
    droppedItems,
    activeItem,
    deleteDroppedItem,
    addDroppedItem,
    selectedUid,
    selectDroppedItem,
  } = useQuestionBuilder();

  console.log('dropped items length is: ', droppedItems);

  const renderQuestion = (item) => {
    switch (item?.id) {
      case 'MultipleChoice':
        return (
          <MultipleChoice
            onDelete={() => deleteDroppedItem(item?.uid)}
            uid={item.uid}
            onEdit={() => selectDroppedItem(item?.uid)}
          />
        );
      case 'MultipleSelect':
        return (
          <MultipleSelect
            onDelete={() => deleteDroppedItem(item?.uid)}
            uid={item.uid}
            onEdit={() => selectDroppedItem(item?.uid)}
          />
        );
      case 'TrueFalse':
        return (
          <TrueFalse
            onDelete={() => deleteDroppedItem(item?.uid)}
            uid={item.uid}
            onEdit={() => selectDroppedItem(item?.uid)}
          />
        );
      case 'Numeric':
        return (
          <NumericEntry
            onDelete={() => deleteDroppedItem(item?.uid)}
            uid={item.uid}
            onEdit={() => selectDroppedItem(item?.uid)}
          />
        );
      case 'Ordering':
        return (
          <OrderingQuestion
            onDelete={() => deleteDroppedItem(item?.uid)}
            uid={item.uid}
            onEdit={() => selectDroppedItem(item?.uid)}
          />
        );
      default:
        return null;
    }
  };
  return (
    <div
      ref={setNodeRef}
      id="drop_zone"
      className="flex items-center justify-center h-full border-2 border-dashed border-gray-600 bg-amber-100 rounded-[8px]"
    >
      {droppedItems?.length > 0 ? (
        droppedItems.map((item) => renderQuestion(item))
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 opacity-60">
          <PiArrowsOut className="h-25 w-25 text-gray-400 " />
          <h4 className="text-gray-800 font-semibold text-lg">
            Drag and Drop Questions Here
          </h4>
        </div>
      )}
    </div>
  );
};

export default DropZoneContainer;
