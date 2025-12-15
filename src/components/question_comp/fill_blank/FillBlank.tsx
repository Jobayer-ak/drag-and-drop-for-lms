'use client';
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

const FillBlank: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview,
  onDelete,
  onEdit,
}) => {
  const inputId = `${uid}-numeric-input`; // unique id for input

  const { selectedUid, duplicateDroppedItem, droppedItems } =
    useQuestionBuilder();
  const singleDroppedItem = droppedItems.find((item) => item.uid === uid);

  return (
    <Card
      className={`border rounded-3xl ${preview ? 'bg-white' : ''} ${
        uid === selectedUid
          ? 'border-2 border-dashed border-blue-400'
          : 'border-gray-200'
      }  rounded-[8px] py-2 cursor-pointer`}
      onClick={() => onEdit?.(uid)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-5">
          {/* Drag handle */}
          <MdOutlineDragIndicator
            className="h-6 w-6 text-gray-400 cursor-move focus:outline-none focus-visible:ring-0"
            {...dragHandleProps}
          />
          <span>
            Fill in the Blank Question___{singleDroppedItem?.data?.questionText}
            ?
          </span>
        </CardTitle>

        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const newUid = duplicateDroppedItem(uid);
                if (newUid) {
                  showSuccess('Numeric question duplicated!');
                }
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

      <CardContent className="text-gray-600 px-8 ">
        <div className="border-b border-gray-200 pb-2 flex items-center gap-2">
          <p className="text-sm gray-400 tracking-wide">
            Fill in the Blank Question
          </p>
          <span className="shadow-xs border border-gray-200 px-2 rounded-[4px]">
            {singleDroppedItem?.data?.answer}
          </span>
          <span> {singleDroppedItem?.data?.questionText}?</span>
        </div>
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          Fill in the blank {singleDroppedItem?.data?.points} Point
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default FillBlank;
