'use client';

import { useDroppable } from '@dnd-kit/core';
import { useEffect, useRef, useState } from 'react';
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

const DropGap = ({ id, height }: { id: string; height?: number }) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`w-full rounded transition-all ${
        isOver ? 'bg-blue-200 border-2 border-blue-400' : ''
      }`}
      style={{ minHeight: height ?? 48 }}
    />
  );
};

const DropZoneContainer = () => {
  const [pendingDeleteUid, setPendingDeleteUid] = useState<string | null>(null);
  const [selected, setSelected] = useState<boolean>(false);

  const { setNodeRef } = useDroppable({ id: 'DROP_ZONE' });
  const { droppedItems, deleteDroppedItem, selectDroppedItem } =
    useQuestionBuilder();

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // console.log('item ref: ', containerRef?.current?.getBoundingClientRect());

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, [droppedItems]);

  // console.log('container height: ', containerRef);

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
      selected,
      setSelected,
      onEdit: () => selectDroppedItem(item.uid),
      onDelete: () => setPendingDeleteUid(item.uid),
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

  // Calculate remaining empty area below last item
  const getBottomGapHeight = () => {
    if (!containerRef.current) return 48;
    const lastItem = Array.from(itemRefs.current.values()).pop();
    if (!lastItem) return containerHeight - 48;
    const rect = lastItem.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    return containerRect.bottom - rect.bottom;
  };

  console.log('dynamic space: ', getBottomGapHeight());

  return (
    <div
      ref={(el) => {
        containerRef.current = el;
        setNodeRef(el);
      }}
      id="drop_zone"
      className="flex flex-col gap-0 bg-white border h-screen overflow-y-auto hide-scrollbar rounded-[8px] p-4"
    >
      {droppedItems.length > 0 ? (
        <div className="flex flex-col w-full">
          {/* Top gap */}
          <DropGap id="slot-0" />

          {droppedItems.map((item, index) => (
            <div
              key={item.uid}
              ref={(el) => {
                if (el) itemRefs.current.set(item.uid, el);
              }}
              className="relative flex flex-col w-full gap-0"
            >
              {renderQuestion(item)}
              {/* Gap after this item */}
              <DropGap id={`slot-${index + 1}`} />
            </div>
          ))}

          {/* Bottom gap */}
          <DropGap
            id={`slot-${droppedItems.length}`}
            height={getBottomGapHeight()}
          />
        </div>
      ) : (
        // Empty drop zone
        <DropGap id="slot-0" height={containerHeight}>
          <div className="flex flex-col items-center justify-center gap-2 py-10 h-full">
            <PiArrowsOut className="h-25 w-25 text-gray-400" />
            <h4 className="text-gray-800 font-semibold text-lg">
              Drag and Drop Questions Here
            </h4>
          </div>
        </DropGap>
      )}

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
