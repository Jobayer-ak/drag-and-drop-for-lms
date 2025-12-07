'use client';

import { IconType } from 'react-icons';
import { BiSolidSelectMultiple } from 'react-icons/bi';
import { BsListCheck } from 'react-icons/bs';
import { FaBarsStaggered, FaCircleDot } from 'react-icons/fa6';
import { GoNumber } from 'react-icons/go';
import { GrDrag } from 'react-icons/gr';
import { PiAlignBottomFill, PiLinkSimpleFill } from 'react-icons/pi';
import { Card, CardContent } from '../ui/card';

export const ICON_MAP: Record<string, IconType> = {
  FaCircleDot,
  BiSolidSelectMultiple,
  BsListCheck,
  PiAlignBottomFill,
  PiLinkSimpleFill,
  GoNumber,
  FaBarsStaggered,
};

interface QItemProps {
  leftIcon: IconType;
  heading: string;
  description: string;
  className?: string;
}

export function QItem({
  leftIcon,
  heading,
  description,
  className,
}: QItemProps) {
  const LeftIcon = leftIcon;

  return (
    <div id="icard" className="min-h-auto">
      <Card
        className={`w-full max-w-sm shadow-none rounded-sm px-4 py-3 bg-white border-0 border-b border-gray-200 ${className} hover:cursor-move `}
      >
        <CardContent className="p-0 flex items-center justify-between gap-6">
          <div className="">
            <LeftIcon className="h-5 w-5 text-green-600" strokeWidth={0.8} />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-md font-semibold text-gray-900 truncate">
              {heading}
            </h3>
            <p className="text-sm font-light">{description}</p>
          </div>

          <div className="">
            <GrDrag className="h-7 w-6 text-green-600" size={10} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
