'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { showSuccess } from '../../../lib/toastHelper';
import { useQuestionBuilder } from '../../../store/questionBuilder';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';

const PREFIX = 'Short Answer Question ';

const schema = z.object({
  questionText: z.string().optional().default(''),
  points: z.coerce.number().min(0).default(1),
});

type FormValues = z.infer<typeof schema>;

const ShortAnswerQ = () => {
  const { droppedItems, selectedUid, updateDroppedItem } = useQuestionBuilder();

  const singleDroppedItem = droppedItems.find(
    (item) => item.uid === selectedUid
  );

  const defaultQuestionText =
    PREFIX + (singleDroppedItem?.data?.questionText ?? '');

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      questionText: defaultQuestionText,
      points: singleDroppedItem?.data.points,
    },
  });

  useEffect(() => {
    if (!singleDroppedItem?.data) return;

    form.reset({
      questionText: PREFIX + (singleDroppedItem?.data?.questionText ?? ''),
      points: singleDroppedItem.data.points,
    });
  }, [singleDroppedItem, form]);

  // Show loader until data is ready
  if (!singleDroppedItem?.data) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-gray-500">Loading question...</span>
      </div>
    );
  }

  // Enforce that PREFIX cannot be deleted
  // const enforcePrefix = (value: string) => {
  //   if (!value.startsWith(PREFIX)) {
  //     return PREFIX + value.replace(PREFIX, '').trimStart();
  //   }
  //   return value;
  // };

  const extractAfterPrefix = (text: string) => {
    if (!text.startsWith(PREFIX)) return '';
    return text.slice(PREFIX.length).trim();
  };

  const onSubmit = (values: FormValues) => {
    if (!selectedUid) return;

    const upData = {
      questionText: extractAfterPrefix(values.questionText ?? ''),
      points: values.points,
    };

    console.log('Updated questionText after prefix:', upData.questionText);

    updateDroppedItem(selectedUid, upData);
    showSuccess('Question updated successfully!');
  };

  const reUseClass =
    'text-gray-600 border rounded-[3px] focus:border-gray-200 focus:outline-none focus:ring-0 border-gray-200';

  return (
    <div>
      <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-md font-semibold">
        Short Answer Question
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

        <TabsContent
          value="general"
          className="flex-1 space-y-6 overflow-y-auto p-6"
        >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Question Text */}
            <div>
              <label className="text-sm font-medium">
                Question Text <span className="text-gray-600">(Required)</span>
              </label>
              <Textarea
                {...form.register('questionText')}
                placeholder="Type your question here..."
                className="mt-2 text-gray-600 border rounded-lg focus:border-gray-200 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 border-gray-200 focus-visible:border-gray-200"
                rows={8}
              />
              {form.formState.errors.questionText && (
                <p className="text-sm text-red-600">
                  {form.formState.errors.questionText.message}
                </p>
              )}
            </div>

            {/* Points */}
            <div>
              <label className="text-sm text-gray-500 font-medium">
                Points
              </label>
              <br />
              <Input
                type="number"
                {...form.register('points')}
                className={`w-full mt-1 ${reUseClass}`}
              />
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-[3px] cursor-pointer"
              >
                Apply Changes
              </Button>
            </div>
          </form>
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

export default ShortAnswerQ;
