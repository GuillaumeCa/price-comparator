export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-7 text-gray-300 max-w-4xl m-auto">
      <h1 className="mb-6 font-bold text-4xl">Price Comparator</h1>
      {children}
    </div>
  );
}
