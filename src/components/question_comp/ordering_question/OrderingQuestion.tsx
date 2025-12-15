'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React from 'react';
import { FiCopy } from 'react-icons/fi';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { showSuccess } from '../../../lib/toastHelper';
import { useQuestionBuilder } from '../../../store/questionBuilder';
import { ComponentNameProps } from '../../../types/types';
import { Badge } from '../../ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card';
import SortableOptions from './SortableOptions';

const OrderingQuestion: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview,
  onDelete,
  onEdit,
}) => {
  const { selectedUid, duplicateDroppedItem, droppedItems, updateDroppedItem } =
    useQuestionBuilder();

  const singleDroppedItem = droppedItems.find((item) => item.uid === uid);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOptionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !singleDroppedItem) return;

    const oldIndex = singleDroppedItem.data.options.findIndex(
      (_: any, index: number) => `${uid}-option-${index}` === active.id
    );

    const newIndex = singleDroppedItem.data.options.findIndex(
      (_: any, index: number) => `${uid}-option-${index}` === over.id
    );

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedOptions = arrayMove(
      singleDroppedItem.data.options,
      oldIndex,
      newIndex
    );

    updateDroppedItem(uid, {
      ...singleDroppedItem.data,
      options: reorderedOptions,
    });

    showSuccess('Options reordered!');
  };

  const optionIds =
    singleDroppedItem?.data?.options.map(
      (_: any, index: number) => `${uid}-option-${index}`
    ) || [];

  return (
    <Card
      className={`border rounded-3xl ${preview ? 'bg-white' : ''} ${
        uid === selectedUid
          ? 'border-2 border-dashed border-blue-400'
          : 'border-gray-200'
      } rounded-[8px] py-2 cursor-pointer`}
      onClick={() => onEdit?.(uid)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-5">
          <MdOutlineDragIndicator
            className="h-6 w-6 text-gray-400 cursor-move"
            {...dragHandleProps}
          />
          Ordering Question
        </CardTitle>

        <CardAction>
          <div className="flex items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                duplicateDroppedItem(uid);
                showSuccess('Ordering question duplicated!');
              }}
            />
            <RiDeleteBinLine
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(uid);
              }}
            />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="text-gray-700">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleOptionDragEnd}
        >
          <SortableContext
            items={optionIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {singleDroppedItem?.data?.options.map(
                (option: any, index: number) => {
                  const optionId = `${uid}-option-${index}`;
                  return (
                    <SortableOptions
                      key={optionId}
                      option={option}
                      index={index}
                      uid={uid}
                      optionId={optionId}
                    />
                  );
                }
              )}
            </div>
          </SortableContext>
          <DragOverlay>
            <div>Hello</div>
          </DragOverlay>
        </DndContext>

        <div className="h-px w-full mt-4 bg-gray-300" />
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          Ordering {singleDroppedItem?.data?.points} Points
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default OrderingQuestion;
