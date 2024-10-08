"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { createQueryString } from "~/app/utils/helpers";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function SearchInput({
  placeholder,
  hideRadios,
}: {
  placeholder: string;
  hideRadios: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const source = searchParams.get("source") ?? "all";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("search", term);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    router.replace(`${pathname}?${params.toString()}`);
    setLoading(false);
  }, 600);

  return (
    <div className="mb-4 ml-4 flex flex-col items-center gap-8 sm:flex-row sm:gap-16">
      <div className="relative">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full min-w-[300px] rounded-md border border-gray-200 py-[9px] pl-4 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            setLoading(true);
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("search")?.toString()}
        />
        <div className="absolute left-60 top-2">
          {loading && <Loader2 className="animate-spin" />}
        </div>
      </div>
      <div>
        {!hideRadios && (
          <RadioGroup
            defaultValue={source}
            className="flex gap-4"
            onValueChange={(val) => {
              const urlParams = createQueryString(
                { source: val },
                searchParams.toString(),
              );
              router.push(`${pathname}?${urlParams}`);
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all">All</label>
            </div>
            {/* <div className="flex items-center space-x-2">
              <RadioGroupItem value="Collection" id="collection" />
              <label htmlFor="collection">In Collection</label>
            </div> */}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Wish List" id="wishlist" />
              <label htmlFor="wishlist">Wish List</label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  );
}
