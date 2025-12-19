'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useRef, useState } from 'react';
import { PiArrowsOut } from 'react-icons/pi';
import { showSuccess } from '../../lib/toastHelper';
import { useQuestionBuilder } from '../../store/questionBuilder';
import { DeleteConfirm } from '../DeleteConfirm';
import SortableItem from '../sortable/Sortabletem';

const DropZoneContainer = ({ containerRef }: { containerRef: any }) => {
  const [pendingDeleteUid, setPendingDeleteUid] = useState<string | null>(null);
  const { droppedItems, deleteDroppedItem } = useQuestionBuilder();

  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [containerHeight, setContainerHeight] = useState<number>(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.getBoundingClientRect().height);
    }
  }, [containerRef, droppedItems]);

  const DropGap = ({
    id,
    height,
    children,
  }: {
    id: string;
    height?: number;
    children?: React.ReactNode;
  }) => {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
      <div
        ref={setNodeRef}
        className={`w-full rounded transition-all ${
          isOver ? 'bg-blue-200 border-2 border-blue-400' : ''
        }`}
        style={{ minHeight: height ?? 48 }}
      >
        {children}
      </div>
    );
  };

  const handleDeleteConfirm = () => {
    if (pendingDeleteUid) {
      deleteDroppedItem(pendingDeleteUid);
      showSuccess('Question deleted successfully!');
      setPendingDeleteUid(null);
    }
  };
  const handleDeleteCancel = () => setPendingDeleteUid(null);

  const getBottomGapHeight = () => {
    if (!containerRef.current) return 48;
    const lastItem = Array.from(itemRefs.current.values()).pop();
    if (!lastItem) return containerHeight - 48;
    const rect = lastItem.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    return containerRect.bottom - rect.bottom;
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col gap-0 p-8 bg-white border border-gray-200 rounded-[8px] min-h-[600px]"
    >
      <SortableContext
        strategy={verticalListSortingStrategy}
        items={droppedItems.map((item) => item.uid)}
      >
        {droppedItems.length > 0 ? (
          <div className="flex flex-col w-full">
            <DropGap id="slot-0" />

            {droppedItems.map((item, index) => (
              <div
                key={item.uid}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.uid, el);
                }}
                className="relative flex flex-col w-full gap-0"
              >
                <SortableItem
                  item={item}
                  setPendingDeleteUid={setPendingDeleteUid}
                />
                <DropGap id={`slot-${index + 1}`} />
              </div>
            ))}

            <DropGap
              id={`slot-${droppedItems.length}`}
              height={getBottomGapHeight()}
            />
          </div>
        ) : (
          <DropGap id={'slot-0'} height={400}>
            <div className="h-[530px] flex flex-col items-center justify-center gap-2 rounded-[8px] border-2 border-dashed border-gray-700">
              <PiArrowsOut className="h-25 w-25 text-gray-400" />
              <h4 className="text-gray-400 font-semibold text-lg">
                Drag and Drop Questions Here
              </h4>
              <p className="text-gray-500 text-sm text-center max-w-md">
                Drag question types from the left panel
                <br />
                and drop them in this area
              </p>
            </div>
          </DropGap>
        )}
      </SortableContext>

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
