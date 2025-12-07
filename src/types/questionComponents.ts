// components/questionComponents.ts
import MultipleChoice from './MultipleChoice';
import MultipleSelect from './MultipleSelect';
// import others similarly

import { QuestionType } from './types';

export const questionComponents: Record<QuestionType, React.FC<any>> = {
  MultipleChoice: MultipleChoice,
  MultipleSelect: MultipleSelect,
  TrueFalse: () => <div>True/False Component</div>,
  FillBlank: () => <div>Fill in the Blank Component</div>,
  Matching: () => <div>Matching Component</div>,
  Numeric: () => <div>Numeric Component</div>,
  Ordering: () => <div>Ordering Component</div>,
};
