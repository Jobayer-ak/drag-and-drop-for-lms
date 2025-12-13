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
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

const MultipleChoice: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview = false,
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
      onClick={() => !preview && onEdit?.(uid)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-5">
          <MdOutlineDragIndicator
            className="h-6 w-6 text-gray-400 cursor-move"
            {...dragHandleProps}
          />
          Multiple Choice Question
        </CardTitle>
        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const newUid = duplicateDroppedItem(uid);
                if (newUid) {
                  showSuccess('Multiple choice question duplicated!');
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
        <RadioGroup
          // value={selected}
          // onValueChange={setSelected}
          className="px-1 text-gray-400"
        >
          {singleDroppedItem?.data?.options?.map((option: any, index: any) => {
            const id = `${uid}-option-${index}`;
            return (
              <div key={option.id} className="flex items-center gap-3">
                <RadioGroupItem
                  value={option.text}
                  checked={option.isCorrect}
                  // onChange={}
                  id={id}
                  className="border border-gray-400"
                />
                <Label htmlFor={id}>{option.text}</Label>
              </div>
            );
          })}
        </RadioGroup>
        <div className="h-px w-full mt-4 mx-1 bg-gray-300"></div>
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          Multiple Choice {singleDroppedItem?.data?.points} Point
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default MultipleChoice;
