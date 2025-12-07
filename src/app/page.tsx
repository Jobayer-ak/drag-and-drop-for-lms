'use client';
import { useEffect, useState } from 'react';
import DropZoneContainer from '../components/drop-zone/DropZoneContainer';
import EditZoneContainer from '../components/edit-zone/EditZoneContainer';
import { ICON_MAP } from '../components/question-items/QItem';
import QuestionTypeZone from '../components/question-type-zone/QuestionTypeZone';

const items = [
  {
    id: 'MultipleChoice',
    name: 'Multiple Choice',
    description: 'Single correct answer from multiple options',
    icon: 'FaCircleDot',
  },
  {
    id: 'MultipleSelect',
    name: 'Multiple Select',
    description: 'Multiple correct answers from options',
    icon: 'BiSolidSelectMultiple',
  },
  {
    id: 'TrueFalse',
    name: 'True/False',
    description: 'Binary choice question',
    icon: 'BsListCheck',
  },
  {
    id: 'FillBlank',
    name: 'Fill in the Blank',
    description: 'Complete missing text in a sentence',
    icon: 'PiAlignBottomFill',
  },
  {
    id: 'Matching',
    name: 'Matching',
    description: 'Match items from two columns',
    icon: 'PiLinkSimpleFill',
  },
  {
    id: 'Numeric',
    name: 'Numeric Entry',
    description: 'Number input with tolerance',
    icon: 'GoNumber',
  },
  {
    id: 'Ordering',
    name: 'Ordering Sequence',
    description: 'Arrange items in correct order',
    icon: 'FaBarsStaggered',
  },
];

export default function Home() {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, [mounted]);

  return (
    <div className="h-screen bg-white flex flex-row  gap-12 px-8 py-4 overflow-hidden">
      <aside className="basis-xs rounded-md overflow-y-auto max-h-full hide-scrollbar">
        <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-lg font-semibold">
          Form Elements
        </h3>
        {mounted &&
          items.map((item) => (
            <div key={item.id}>
              <QuestionTypeZone
                leftIcon={ICON_MAP[item.icon]}
                heading={item.name}
                description={item.description}
              />
            </div>
          ))}
      </aside>
      <main className="basis-lg border border-gray-200 rounded-sm p-2 mt-5">
        <DropZoneContainer />
      </main>
      <aside className="basis-sm border border-gray-200">
        <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-md font-semibold">
          Ordering/Selection
        </h3>
        <EditZoneContainer />
      </aside>
    </div>
  );
}
