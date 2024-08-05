"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const router = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 600);

  return (
    <div className="mb-4 ml-4 flex items-center gap-16">
      <div>
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full min-w-[300px] rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("search")?.toString()}
        />
      </div>
      <div>
        <RadioGroup defaultValue="all" className="flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <label htmlFor="all">All</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="collection" id="collection" />
            <label htmlFor="collection">In Collection</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="wishlist" id="wishlist" />
            <label htmlFor="wishlist">Wish List</label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
