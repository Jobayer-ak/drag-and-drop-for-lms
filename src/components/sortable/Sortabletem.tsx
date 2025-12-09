'use client';

import { useSortable } from '@dnd-kit/sortable';
import { DroppedQuestion } from '../../types/types';

import { CSS } from '@dnd-kit/utilities';
import { useQuestionBuilder } from '../../store/questionBuilder';
import MultipleChoice from '../question_comp/multiple_choice/MultipleChoice';
import { MultipleSelect } from '../question_comp/multiple_select/MultipleSelect';
import NumericEntry from '../question_comp/numeric_entry/NumericEntry';
import OrderingQuestion from '../question_comp/ordering_question/OrderingQuestion';
import TrueFalse from '../question_comp/true_false/TrueFalse';

interface SortableItemProps {
  item: DroppedQuestion;
  setPendingDeleteUid: any;
}

const SortableItem: React.FC<SortableItemProps> = ({
  item,
  setPendingDeleteUid,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.uid,
    // Restrict to vertical movement only
    data: {
      type: 'sortable-item',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform), // ← This respects modifiers!
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 1,
  };

  const dragHandleProps = { ...listeners, ...attributes };

  const { selectDroppedItem } = useQuestionBuilder();

  const renderQuestion = (item: DroppedQuestion) => {
    // console.log('uid: ', item);

    // setActiveItem(item?.type);
    const commonProps = {
      uid: item.uid,
      onEdit: () => selectDroppedItem(item.uid),
      onDelete: () => setPendingDeleteUid(item.uid),
      dragHandleProps,
    };

    switch (item?.id) {
      case 'MultipleChoice':
        return <MultipleChoice key={item.uid} {...commonProps} />;
      case 'MultipleSelect':
        return <MultipleSelect key={item.uid} {...commonProps} />;
      case 'TrueFalse':
        return <TrueFalse key={item.uid} {...commonProps} />;
      case 'Numeric':
        return <NumericEntry key={item.uid} {...commonProps} />;
      case 'Ordering':
        return <OrderingQuestion key={item.uid} {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} className="w-full relative" style={style}>
      {renderQuestion(item)}
    </div>
  );
};

export default SortableItem;
