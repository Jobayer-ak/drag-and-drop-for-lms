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

const OrderingQuestion: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview,
  onDelete,
  onEdit,
}) => {
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
          {/* Drag handle for the whole card */}
          <MdOutlineDragIndicator
            className="h-6 w-6 text-gray-400 cursor-move focus:outline-none focus:ring-0"
            {...dragHandleProps}
          />
          Ordering Question
        </CardTitle>

        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const newUid = duplicateDroppedItem(uid);
                if (newUid) {
                  showSuccess('Ordering question duplicated!');
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

      <CardContent className="text-gray-700">
        <div className="flex flex-col gap-2">
          {singleDroppedItem?.data?.options.map((option, index) => {
            const optionId = `${uid}-option-${index}`;
            return (
              <div
                key={optionId}
                className="ms-1 px-2 border border-gray-200 rounded-[3px] py-1"
              >
                <div className="flex items-center gap-3 text-gray-400 py-1">
                  <MdOutlineDragIndicator
                    className="h-4 w-4 text-gray-400"
                    // {...dragHandleProps}
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
          })}
        </div>

        <div className="h-px w-full mt-4 mx-1 bg-gray-300"></div>
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
