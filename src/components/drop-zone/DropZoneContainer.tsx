'use client';

import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { PiArrowsOut } from 'react-icons/pi';
import { showSuccess } from '../../lib/toastHelper';
import {
  DroppedQuestion,
  useQuestionBuilder,
} from '../../store/questionBuilder';
import { DeleteConfirm } from '../DeleteConfirm';
import MultipleChoice from '../question_comp/multiple_choice/MultipleChoice';
import { MultipleSelect } from '../question_comp/multiple_select/MultipleSelect';
import NumericEntry from '../question_comp/numeric_entry/NumericEntry';
import OrderingQuestion from '../question_comp/ordering_question/OrderingQuestion';
import TrueFalse from '../question_comp/true_false/TrueFalse';

const DropZoneContainer = () => {
  const [pendingDeleteUid, setPendingDeleteUid] = useState<string | null>(null);

  const { setNodeRef, active, isOver, over } = useDroppable({
    id: 'DROP_ZONE',
  });

  const {
    droppedItems,
    deleteDroppedItem,

    selectDroppedItem,
  } = useQuestionBuilder();

  console.log('dropped items length is: ', droppedItems);

  // Handle confirmation delete
  const handleDeleteConfirm = () => {
    if (pendingDeleteUid) {
      deleteDroppedItem(pendingDeleteUid);
      showSuccess('Question deleted successfully!');
      setPendingDeleteUid(null);
    }
  };

  const handleDeleteCancel = () => setPendingDeleteUid(null);

  const renderQuestion = (item: DroppedQuestion) => {
    const commonProps = {
      key: item.uid,
      uid: item.uid,
      onEdit: () => selectDroppedItem(item.uid),
      onDelete: () => setPendingDeleteUid(item.uid), // trigger confirmation
    };
    switch (item?.id) {
      case 'MultipleChoice':
        return <MultipleChoice {...commonProps} />;
      case 'MultipleSelect':
        return <MultipleSelect {...commonProps} />;
      case 'TrueFalse':
        return <TrueFalse {...commonProps} />;
      case 'Numeric':
        return <NumericEntry {...commonProps} />;
      case 'Ordering':
        return <OrderingQuestion {...commonProps} />;
      default:
        return null;
    }
  };
  return (
    <div
      ref={setNodeRef}
      id="drop_zone"
      className={`flex flex-col gap-3 h-full ${
        active ? 'border-2 border-dashed border-gray-600 rounded-[8px]' : ''
      }  overflow-y-auto hide-scrollbar`}
    >
      {droppedItems?.length > 0 ? (
        <div className="p-8 space-y-3">
          {droppedItems.map((item) => renderQuestion(item))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 opacity-60">
          <PiArrowsOut className="h-25 w-25 text-gray-400 " />
          <h4 className="text-gray-800 font-semibold text-lg">
            Drag and Drop Questions Here
          </h4>
        </div>
      )}

      {/* Global Delete Confirmation Dialog */}
      {pendingDeleteUid && (
        <DeleteConfirm
          open={Boolean(pendingDeleteUid)}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
        />
      )}
    </div>
  );
};

export default DropZoneContainer;
