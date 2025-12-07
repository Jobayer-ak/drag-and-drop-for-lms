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
import { Label } from '../../ui/label';
import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';

// export interface MultipleChoiceProps extends ComponentNameProps {
//   dragHandleProps?: any;
//   preview?: boolean;
//   onDelete?: (uid: string) => void; // ← ADDED
// }

const MultipleChoice: React.FC<ComponentNameProps> = ({
  uid,
  dragHandleProps,
  preview,
  onDelete, // ← Destructured
  onEdit,
}) => {
  const options = ['Option 1', 'Option 2', 'Option 3'];
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <Card
      className={`border rounded-3xl ${
        preview ? 'bg-white' : ''
      } border-gray-200 rounded-lg py-2`}
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
                onEdit?.(uid);
                setSelected(true);
              }}
            />
            <RiDeleteBinLine
              className="h-5 w-5 text-gray-400 cursor-pointer"
              // className="h-5 w-5 text-red-500 hover:text-red-700 cursor-pointer transition-colors"
              onClick={(e) => {
                e.stopPropagation(); // ← Prevents drag
                onDelete?.(uid); // ← Calls parent delete
              }}
            />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        <RadioGroup
          value={selected}
          onValueChange={setSelected}
          className="px-1 text-gray-400"
        >
          {options.map((option, index) => {
            const id = `${uid}-option-${index}`;
            return (
              <div key={id} className="flex items-center gap-3">
                <RadioGroupItem
                  value={option}
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
          Multiple Choice 1 Point
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default MultipleChoice;
