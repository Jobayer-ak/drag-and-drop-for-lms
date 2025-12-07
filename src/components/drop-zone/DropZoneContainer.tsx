'use client';

import { PiArrowsOutDuotone } from 'react-icons/pi';

const DropZoneContainer = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-2 opacity-60">
        <PiArrowsOutDuotone className="h-15 w-15 text-gray-700" />
        <h4 className="text-gray-800 font-semibold text-lg">Drop Zone</h4>
      </div>
    </div>
  );
};

export default DropZoneContainer;
