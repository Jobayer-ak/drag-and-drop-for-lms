/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

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
import { Checkbox } from '../../ui/checkbox';
import { Label } from '../../ui/label';

export const MultipleSelect: React.FC<ComponentNameProps> = ({
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
          {/* Drag starts only when grabbing this icon */}
          <MdOutlineDragIndicator
            className="h-6 w-6 text-gray-400 cursor-move focus:outline-none focus:ring-0"
            {...dragHandleProps}
          />
          Multiple Select Question
        </CardTitle>
        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const newUid = duplicateDroppedItem(uid);
                if (newUid) {
                  showSuccess('Multiple selector question duplicated!');
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

      <CardContent>
        <div className="flex flex-col gap-4 text-gray-400 px-1.5">
          {singleDroppedItem?.data?.options.map((option: any, index: any) => {
            const id = `${uid}-option-${index}`;
            return (
              <div key={id} className="flex items-center gap-3">
                <Checkbox id={id} checked={option.isCorrect} />
                <Label htmlFor={id}>{option.text}</Label>
              </div>
            );
          })}
        </div>

        <div className="h-px w-full mt-4 mx-1 bg-gray-300"></div>
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          Multiple Select {singleDroppedItem?.data?.points} Points
        </Badge>
      </CardFooter>
    </Card>
  );
};
