import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeleteConfirmProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  children?: React.ReactNode;
}

export const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
  open,
  onConfirm,
  onCancel,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <AlertDialogContent className="bg-white border w-[250px] h-[150px] border-gray-200  shadow-lg rounded-[4px] px-3 py-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-gray-900 text-lg font-semibold">
            Are you sure?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex justify-end gap-3">
          <AlertDialogCancel className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
