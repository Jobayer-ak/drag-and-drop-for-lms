/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import MultipleChoice from './question_comp/multiple_choice/MultipleChoice';
import { MultipleSelect } from './question_comp/multiple_select/MultipleSelect';
import NumericEntry from './question_comp/numeric_entry/NumericEntry';
import OrderingQuestion from './question_comp/ordering_question/OrderingQuestion';
import TrueFalse from './question_comp/true_false/TrueFalse';

interface IDropItems {
  type: string;
  uid: string;
}

interface SortingPreviewProps {
  sortingDragActiveId: any;
  droppedItems: IDropItems[]; // This should be an array
}

const SortingPreview = ({
  sortingDragActiveId,
  droppedItems,
}: SortingPreviewProps) => {
  console.log('sorting preview droppedItems: ', droppedItems);

  // const res = droppedItems.filter((item) => item.uid === sortingDragActiveId);
  console.log('prview target id: ', sortingDragActiveId);

  const renderQuestion = () => {
    switch (sortingDragActiveId[0].type) {
      case 'MultipleChoice':
        return (
          <MultipleChoice uid={sortingDragActiveId[0].uid} preview={true} />
        );
      case 'MultipleSelect':
        return (
          <MultipleSelect uid={sortingDragActiveId[0].uid} preview={true} />
        );
      case 'TrueFalse':
        return <TrueFalse uid={sortingDragActiveId[0].uid} preview={true} />;
      case 'Numeric':
        return <NumericEntry uid={sortingDragActiveId[0].uid} preview={true} />;
      case 'Ordering':
        return (
          <OrderingQuestion uid={sortingDragActiveId[0].uid} preview={true} />
        );
      default:
        return <div>{''}</div>;
    }
  };

  return <div>{renderQuestion()}</div>;
};

export default SortingPreview;
