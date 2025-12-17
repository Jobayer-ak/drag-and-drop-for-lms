'use client';

import React, { useState } from 'react';
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
import { Textarea } from '../../ui/textarea';

const ShortAnswer: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview,
  onDelete,
  onEdit,
}) => {
  const [selected, setSelected] = useState('');

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
            className="h-6 w-6 text-gray-400 cursor-move focus:outline-none focus:ring-0"
            {...dragHandleProps}
          />
          Short Answer Question {singleDroppedItem?.data?.questionText}
        </CardTitle>
        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const newUid = duplicateDroppedItem(uid);
                if (newUid) {
                  showSuccess('Short Answer question duplicated successfully!');
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
        <Textarea
          placeholder="Short answer text"
          className="mt-2 rounded-[3px] text-gray-600 border bg-gray-100 focus:border-gray-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 border-gray-200 focus-visible:border-gray-200"
          rows={8}
        />
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          Short Answer {singleDroppedItem?.data?.points} Point
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ShortAnswer;
