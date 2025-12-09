'use client';

import { useRef, useState } from 'react';

export default function Page() {
  const [items, setItems] = useState<string[]>(['1', '3']); // Try [], ['1'], ['1','2','3']
  const containerRef = useRef<HTMLDivElement>(null);

  // This state tells us exactly where the drag is happening
  const [activeDropZone, setActiveDropZone] = useState<{
    position: 'top' | 'middle' | 'bottom';
    index: number; // for middle: index of the item above the gap
  } | null>(null);

  // Simulate drag over (in real dnd-kit you get this from onDragOver)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    const children = Array.from(containerRef.current.children).filter(
      (c) => (c as HTMLElement).dataset.role !== 'drop-indicator'
    );

    let found = false;

    // Check above first item
    if (
      children.length === 0 ||
      y < (children[0] as HTMLElement).offsetTop - 20
    ) {
      setActiveDropZone({ position: 'top', index: 0 });
      found = true;
    }

    // Check between items and below last
    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const nextChild = children[i + 1] as HTMLElement;

      const childBottom = child.offsetTop + child.offsetHeight;

      if (y > childBottom - 20 && y < childBottom + 20) {
        setActiveDropZone({ position: 'middle', index: i + 1 });
        found = true;
        break;
      }

      // Below last item
      if (!nextChild && y > childBottom + 20) {
        setActiveDropZone({ position: 'bottom', index: items.length });
        found = true;
      }
    }

    if (!found) setActiveDropZone(null);
  };

  const handleMouseLeave = () => setActiveDropZone(null);

  const addItem = () => {
    setItems([...items, `${Date.now()}`]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <button
        onClick={addItem}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        Add New Item
      </button>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative min-h-screen bg-white rounded-xl shadow-lg p-8 border-2 border-dashed border-gray-300"
      >
        {/* Full container highlight when empty */}
        {items.length === 0 && activeDropZone && (
          <div className="absolute inset-8 bg-blue-500 bg-opacity-20 border-4 border-blue-500 border-dashed rounded-xl pointer-events-none" />
        )}

        {/* Highlight line above first item */}
        {activeDropZone?.position === 'top' && (
          <div className="absolute left-8 right-8 top-8 h-2 bg-blue-500 rounded-full shadow-lg pointer-events-none z-10 animate-pulse" />
        )}

        {/* Render items with gap highlights between them */}
        {items.map((id, index) => (
          <div key={id} className="relative">
            {/* Highlight BETWEEN items */}
            {activeDropZone?.position === 'middle' &&
              activeDropZone.index === index + 1 && (
                <div className="absolute left-8 right-8 -top-1 h-2 bg-blue-500 rounded-full shadow-lg pointer-events-none z-10 animate-pulse" />
              )}

            <div className="my-8 p-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl shadow-md text-center text-2xl font-bold">
              Item {id}
            </div>
          </div>
        ))}

        {/* Highlight below last item */}
        {activeDropZone?.position === 'bottom' && (
          <div className="absolute left-8 right-8 bottom-8 h-2 bg-blue-500 rounded-full shadow-lg pointer-events-none z-10 animate-pulse" />
        )}
      </div>

      {/* Debug */}
      <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg font-mono text-sm">
        {activeDropZone
          ? `Active: ${JSON.stringify(activeDropZone)}`
          : 'No active zone'}
      </div>
    </div>
  );
}

// 'use client';

// import { useEffect, useRef, useState } from 'react';

// export default function Page() {
//   const parentRef = useRef<HTMLDivElement>(null);
//   const [remainingHeight, setRemainingHeight] = useState(0);
//   const [childrenTotalHeight, setChildrenTotalHeight] = useState(0);

//   useEffect(() => {
//     if (!parentRef.current) return;

//     const parent = parentRef.current;

//     console.log('Parent ref: ', parent.clientHeight);

//     const updateHeight = () => {
//       const parentHeight = parent.clientHeight; // e.g. 1080px (screen height)
//       let childrenHeight = 0;

//       // Sum all direct children heights (including margins)
//       Array.from(parent.children).forEach((child) => {
//         const style = window.getComputedStyle(child);
//         const marginTop = parseFloat(style.marginTop);
//         const marginBottom = parseFloat(style.marginBottom);
//         childrenHeight += child.clientHeight + marginTop + marginBottom;
//       });

//       setChildrenTotalHeight(Math.round(childrenHeight));
//       setRemainingHeight(Math.round(parentHeight - childrenHeight));
//     };

//     // Initial calculation
//     updateHeight();

//     // Recalculate on resize and when children change
//     const resizeObserver = new ResizeObserver(updateHeight);
//     resizeObserver.observe(parent);

//     // Also observe each child if they can change size
//     Array.from(parent.children).forEach((child) => {
//       resizeObserver.observe(child as Element);
//     });

//     return () => resizeObserver.disconnect();
//   }, []);

//   return (
//     <div ref={parentRef} className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Your dynamic children */}
//       <div className="p-8 bg-white m-4 rounded shadow">Item 1</div>
//       <div className="p-8 bg-white m-4 rounded shadow">Item 2</div>
//       <div className="p-8 bg-white m-4 rounded shadow">
//         Item 3 (added later)
//       </div>

//       {/* Debug panel – remove in production or make optional */}
//       <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-sm font-mono">
//         <div>Parent height: {parentRef.current?.clientHeight}px</div>
//         <div>Children total: {childrenTotalHeight}px</div>
//         <div className="text-green-400 font-bold">
//           Remaining space: {remainingHeight}px
//         </div>
//       </div>
//     </div>
//   );
// }
