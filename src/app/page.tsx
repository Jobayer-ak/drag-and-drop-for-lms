export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-row  gap-18 px-8 py-4">
      <aside className="basis-xs rounded-md">
        <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-lg font-semibold">
          Form Elements
        </h3>
      </aside>
      <main className="basis-md border border-gray-200 rounded-sm p-2 mt-5">
        Drop Zone
      </main>
      <aside className="basis-md border border-gray-200">
        <h3 className="bg-gray-200 text-gray-700  text-center py-4 text-md font-semibold">
          Ordering/Selection
        </h3>
      </aside>
    </div>
  );
}
