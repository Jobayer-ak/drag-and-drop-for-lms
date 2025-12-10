'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

const NumericQ = () => {
  return (
    <div>
      <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-md font-semibold">
        Numeric Entry Question
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
  );
};

export default NumericQ;
