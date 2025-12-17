'use client';

import React, { useState } from 'react';
import { AiFillPlusCircle } from 'react-icons/ai';
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
import { Input } from '../../ui/input';

const FileUpload: React.FC<ComponentNameProps> = ({
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
          File Upload Question
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

      <CardContent>
        <label className="relative flex flex-col items-center justify-center w-full h-32 border border-gray-200 rounded-[6px] bg-gray-100 cursor-pointer hover:bg-gray-200">
          {/* Upload icon and text */}
          <div className="flex flex-col items-center justify-center text-gray-500">
            <AiFillPlusCircle className="text-3xl mb-2" />
            <p className="text-sm">upload your signature (max size 5mb)</p>
            <p className="text-sm">Allowed File: .jpeg .jpg .png</p>
          </div>
          {/* Hidden input */}
          <Input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>
      </CardContent>

      <CardFooter className="pb-2 pt-0">
        <Badge className="bg-blue-700 text-white text-xs">
          File Upload {singleDroppedItem?.data?.points} Point
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default FileUpload;
