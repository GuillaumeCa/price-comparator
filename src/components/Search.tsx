export function Search({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <div className="mt-3">
      <input
        className="px-4 py-2 w-full bg-gray-700 focus:bg-gray-600 focus:outline-none rounded-md"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
