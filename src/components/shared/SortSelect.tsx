"use client"

const sortOptions = [
  { value: "newest", label: "Terbaru" },
  { value: "oldest", label: "Terlama" },
  { value: "price_asc", label: "Harga: Termurah" },
  { value: "price_desc", label: "Harga: Termahal" },
  { value: "popular", label: "Terpopuler" },
];

export default function SortSelect({ current }: { current: string }) {
  return (
    <form method="GET">
      <select
        name="sort"
        defaultValue={current}
        onChange={(e) => (e.target.form as HTMLFormElement).submit()}
        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </form>
  );
}
