"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Search } from "lucide-react";

export default function SearchBar({ defaultValue = ""}: { defaultValue?: string}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const q = (form.elements.namedItem("q") as HTMLInputElement).value.trim();
        const params = new URLSearchParams(searchParams.toString());
        if(q) {
            params.set("q", q);
        } else {
            params.delete("q");
        }
        params.delete("page")
        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }
    return (
        <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        name="q"
        defaultValue={defaultValue}
        placeholder="Cari produk..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
      />
      {isPending && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
          ...
        </span>
      )}
    </form>
    );
}