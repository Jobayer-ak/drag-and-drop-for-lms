'use client';

import { useEffect } from 'react';
import { useQuestionBuilder } from '../../store/questionBuilder';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import FillBlankQ from './create-question/FillBlankQ';
import MultipleChoiceQ from './create-question/MultipleChoiceQ';
import MultipleSelectQ from './create-question/MultipleSelectQ';
import NumericQ from './create-question/NumericQ';
import OrderingQ from './create-question/OrderingQ';
import TrueFalseQ from './create-question/TrueFalseQ';

const EditZoneContainer = () => {
  const { selectedUid, activeItem, droppedItems, lastDroppedItem } =
    useQuestionBuilder();

  useEffect(() => {}, [selectedUid, droppedItems]);

  const currentItem = selectedUid
    ? droppedItems.find((item) => item.uid === selectedUid)?.id
    : activeItem?.id || lastDroppedItem?.id;

  console.log('it: ', currentItem);

  return (
    <div className="hide-scrollbar">
      {droppedItems?.length < 1 && (
        <div>
          <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-md font-semibold">
            Question
          </h3>
          <Tabs defaultValue="general" className="">
            <TabsList className="grid grid-cols-3 gap-5 w-full h-12 shadow-sm pb-0">
              <TabsTrigger
                value="general"
                className="text-md text-gray-500 pointer-cursor font-semibold data-[state=active]:border-b-gray-400 data-[state=active]:text-gray-900
            data-[state=active]:shadow-none
            "
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="rubrics"
                className="text-md text-gray-500 font-semibold pointer-cursor data-[state=active]:border-b-gray-400 data-[state=active]:text-gray-900
            data-[state=active]:shadow-none
            "
              >
                Rubrics
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="text-md text-gray-500 font-semibold pointer-cursor data-[state=active]:border-b-gray-400 data-[state=active]:text-gray-900
            data-[state=active]:shadow-none
            "
              >
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="px-4 py-2">
              <h2> General</h2>
            </TabsContent>
            <TabsContent value="rubrics">
              <h2>Rubrics</h2>
            </TabsContent>
            <TabsContent value="settings">
              <h2>Settings</h2>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {currentItem === 'MultipleChoice' && <MultipleChoiceQ />}
      {currentItem === 'MultipleSelect' && <MultipleSelectQ />}
      {currentItem === 'TrueFalse' && <TrueFalseQ />}
      {currentItem === 'FillBlank' && <FillBlankQ />}

      {currentItem === 'Numeric' && <NumericQ />}
      {currentItem === 'Ordering' && <OrderingQ />}
    </div>
  );
};

export default EditZoneContainer;
