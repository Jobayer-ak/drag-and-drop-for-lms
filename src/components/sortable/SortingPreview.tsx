'use client';

import { useQuestionBuilder } from '../../store/questionBuilder';
import FillBlank from '../question_comp/fill_blank/FillBlank';
import LongAnswer from '../question_comp/long-answer/LongAnswer';
import MultipleChoice from '../question_comp/multiple_choice/MultipleChoice';
import { MultipleSelect } from '../question_comp/multiple_select/MultipleSelect';
import NumericEntry from '../question_comp/numeric_entry/NumericEntry';
import OrderingQuestion from '../question_comp/ordering_question/OrderingQuestion';
import ShortAnswer from '../question_comp/short-answer/ShortAnswer';
import TrueFalse from '../question_comp/true_false/TrueFalse';

interface IPreview {
  previewId: string;
}

const SortingPreview: React.FC<IPreview> = ({ previewId }) => {
  console.log('previewiD: ', previewId);

  const { droppedItems } = useQuestionBuilder();

  const previewItem = droppedItems.filter((item) => item.uid === previewId);

  console.log('preiew item: ', previewItem);

  const renderQuestion = () => {
    switch (previewItem[0]?.id) {
      case 'MultipleChoice':
        return <MultipleChoice uid={previewItem[0].uid} preview={true} />;
      case 'MultipleSelect':
        return <MultipleSelect uid={previewItem[0].uid} preview={true} />;
      case 'TrueFalse':
        return <TrueFalse uid={previewItem[0].uid} preview={true} />;
      case 'FillBlank':
        return <FillBlank uid={previewItem[0].uid} preview={true} />;
      case 'Numeric':
        return <NumericEntry uid={previewItem[0].uid} preview={true} />;
      case 'Ordering':
        return <OrderingQuestion uid={previewItem[0].uid} preview={true} />;
      case 'ShortAnswer':
        return <ShortAnswer uid={previewItem[0].uid} preview={true} />;
      case 'LongAnswer':
        return <LongAnswer uid={previewItem[0].uid} preview={true} />;
      default:
        return <div>{''}</div>;
    }
  };

  return <div>{renderQuestion()}</div>;
};

export default SortingPreview;
