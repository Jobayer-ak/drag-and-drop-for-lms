'use client';

import { FaCircleCheck } from 'react-icons/fa6';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { toast, Toaster } from 'sonner';

export const GlobalToaster = () => (
  <Toaster
    position="top-center"
    richColors
    toastOptions={{
      duration: 3000,
      style: {
        background: '#ffffff',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontSize: '14px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    }}
  />
);

export const showSuccess = (message: string) =>
  toast.success(message, {
    icon: <FaCircleCheck className="w-5 h-5 text-white" fill="green" />,
  });

export const showError = (message: string) =>
  toast.error(message, {
    icon: <IoCloseCircleSharp className="w-5 h-5 text-red-600" />,
  });
