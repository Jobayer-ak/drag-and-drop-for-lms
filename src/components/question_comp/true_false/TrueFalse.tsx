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
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

const TrueFalse: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview,

  onDelete,
  onEdit,
}) => {
  const options = ['True', 'False'];

  const [selected, setSelected] = useState('');

  const { selectedUid, duplicateDroppedItem } = useQuestionBuilder();

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
          True or False Question
        </CardTitle>
        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                const newUid = duplicateDroppedItem(uid);
                if (newUid) {
                  showSuccess('True/False question duplicated!');
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
          value={selected}
          onValueChange={(val) => setSelected(val)}
          className="px-1 text-gray-400"
        >
          {options.map((option, index) => {
            const id = `${uid}-option-${index}`;
            return (
              <div key={id} className="flex items-center gap-3">
                <RadioGroupItem
                  value={option.toLowerCase()}
                  id={id}
                  className="border border-gray-400"
                />
                <Label htmlFor={id}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>

        <div className="h-px w-full mt-4 mx-1 bg-gray-300"></div>
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          True/False 1 Point
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default TrueFalse;
