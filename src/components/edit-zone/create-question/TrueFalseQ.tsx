'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroupItem } from '@radix-ui/react-radio-group';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { showSuccess } from '../../../lib/toastHelper';
import { useQuestionBuilder } from '../../../store/questionBuilder';
import { EditorOption, QuestionState } from '../../../store/questionEditor';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { RadioGroup } from '../../ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Textarea } from '../../ui/textarea';

const schema = z.object({
  questionText: z.string().min(3, 'Question too short'),
  points: z.coerce.number().min(0).default(1),
});

type FormValues = z.infer<typeof schema>;

const TrueFalseQ = () => {
  // const [selected, setSelected] = useState('');
  const [localState, setLocalState] = useState<QuestionState | null>(null);
  const { droppedItems, selectedUid, lastDroppedItem, updateDroppedItem } =
    useQuestionBuilder();

  const singleDroppedItem = droppedItems.find(
    (item) => item.uid === selectedUid
  );

  console.log('single check data: ', singleDroppedItem);

  useEffect(() => {
    if (singleDroppedItem?.data) {
      setLocalState({
        ...singleDroppedItem.data,
        options: [...(singleDroppedItem.data.options ?? [])],
      });
    }
  }, [singleDroppedItem]);

  useEffect(() => {}, [selectedUid]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      questionText: singleDroppedItem?.data.questionText,
      points: singleDroppedItem?.data.points,
    },
  });

  useEffect(() => {
    if (!singleDroppedItem?.data) return;

    form.reset({
      questionText: singleDroppedItem.data.questionText,
      points: singleDroppedItem.data.points,
    });

    setLocalState({
      ...singleDroppedItem.data,
      options: [...(singleDroppedItem.data.options ?? [])],
    });
  }, [singleDroppedItem, form]);

  const updateOptions = (opts: EditorOption[]) => {
    setLocalState((prev) =>
      prev
        ? {
            ...prev,
            options: opts,
          }
        : prev
    );
  };

  const setCorrectOption = (id: string) => {
    if (!localState?.options) return;

    updateOptions(
      localState.options.map((o) => ({
        ...o,
        isCorrect: o.id === id,
      }))
    );
  };

  const onSubmit = (values: FormValues) => {
    console.log('form data: ', values);
    if (!localState) return;

    console.log('Local state: ', localState);

    const opts = localState.options ?? [];
    const hasCorrect = opts.some((o) => o.isCorrect);

    const finalOptions = hasCorrect
      ? opts
      : opts.map((o, idx) => ({
          ...o,
          isCorrect: idx === 0,
        }));

    const upData = {
      ...localState,
      questionText: values.questionText,
      points: values.points,
      options: finalOptions,
    };

    if (!selectedUid) return;

    updateDroppedItem(selectedUid, upData);

    showSuccess('Question updated successfully!');
  };

  const reUseClass =
    'text-gray-600 border rounded-[3px] focus:border-gray-200 focus:outline-none focus:ring-0 focus-visible:outline-none  focus-visible:ring-0 border-gray-200 focus-visible:border-gray-200';

  if (!localState) return null;

  return (
    <div>
      <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-md font-semibold">
        True/False Question
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
              <label className="text-sm text-gray-500 font-medium mr-4">
                Points
              </label>
              <br />
              <Input
                type="number"
                {...form.register('points')}
                className={`w-45 mt-1 ${reUseClass}`}
              />
            </div>

            {/* Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-start gap-4 mb-2">
                <span className="text-sm font-medium">Options</span>
                <span className="text-xs text-gray-500">
                  (Select the right one)
                </span>
              </div>
            </div>

            <RadioGroup
              // value={selected}
              // onValueChange={setSelected}
              className="px-1 text-gray-400"
            >
              {localState?.options?.map((option: any, index: any) => {
                const id = option.text;
                return (
                  <div key={option.id} className="flex items-center gap-3">
                    <div className="border border-gray-200 rounded-[3px] px-4 py-3 w-71 flex items-center">
                      <RadioGroupItem
                        value={option.text}
                        checked={option.isCorrect}
                        // onChange={}
                        id={id}
                        className=""
                      />
                      <Label htmlFor={id} className="text-gray-600">
                        {option.text}
                      </Label>
                    </div>
                    <div className="">
                      <Checkbox
                        checked={option.isCorrect}
                        onCheckedChange={() => setCorrectOption(option.id)}
                        className="h-5 w-5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=unchecked]:bg-white data-[state=unchecked]:border-gray-300 data-[state=checked]:text-white"
                      />
                    </div>
                  </div>
                );
              })}
            </RadioGroup>
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

export default TrueFalseQ;
