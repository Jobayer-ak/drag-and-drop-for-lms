'use client';

import { useState } from 'react';
import { FiCopy } from 'react-icons/fi';
import { MdOutlineDragIndicator } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
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
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const handleChange = (option: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  console.log('uid: ', uid);

  return (
    <Card
      className={`border ${
        preview ? 'bg-white' : ''
      } border-gray-200 rounded-lg py-2`}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-5">
          {/* Drag starts only when grabbing this icon */}
          <MdOutlineDragIndicator
            className="h-6 w-6 text-gray-400 cursor-move focus:outline-none focus:ring-0"
            {...dragHandleProps} // <-- attach listeners here
          />
          Multiple Select Question
        </CardTitle>
        <CardAction>
          <div className="flex justify-end items-center gap-2">
            <FiCopy
              className="h-5 w-5 text-gray-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation(); // ← Prevents drag
                onEdit?.(uid); // ← Calls parent delete
              }}
            />
            <RiDeleteBinLine
              className="h-5 w-5 text-gray-400 cursor-pointer"
              // className="h-5 w-5 text-red-300 hover:text-red-700 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // ← Prevents drag
                onDelete?.(uid); // ← Calls parent delete
              }}
            />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 text-gray-400 px-1.5">
          {options.map((option, index) => {
            const id = `${uid}-option-${index}`;
            return (
              <div key={id} className="flex items-center gap-3">
                <Checkbox
                  id={id}
                  checked={checkedItems[option] || false}
                  onCheckedChange={() => handleChange(option)}
                />
                <Label htmlFor={id}>{option}</Label>
              </div>
            );
          })}
        </div>

        <div className="h-px w-full mt-4 mx-1 bg-gray-300"></div>
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          Multiple Select 2 Points
        </Badge>
      </CardFooter>
    </Card>
  );
};
