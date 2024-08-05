"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createQueryString } from "~/app/utils/helpers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function CardListOptions() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageSize = searchParams.get("pageSize") ?? "30";
  const displayAs = searchParams.get("displayAs") ?? "images";
  const orderBy = searchParams.get("orderBy") ?? "number";

  return (
    <div className="mb-4 mt-4 flex gap-8">
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <label htmlFor="order">Order By</label>
        <Select
          name="order"
          onValueChange={(val) => {
            const urlParams = createQueryString(
              { orderBy: val },
              searchParams.toString(),
            );
            router.push(`${pathname}?${urlParams}`);
          }}
          defaultValue={orderBy}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Number" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="priceASC">Price ASC</SelectItem>
            <SelectItem value="priceDESC">Price DESC</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <label htmlFor="pageSize">Show</label>
        <Select
          name="pageSize"
          onValueChange={(val) => {
            const urlParams = createQueryString(
              { pageSize: val },
              searchParams.toString(),
            );
            router.push(`${pathname}?${urlParams}`);
          }}
          defaultValue={pageSize}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="30 cards" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 cards</SelectItem>
            <SelectItem value="120">120 cards</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col items-center gap-2 sm:flex-row">
        <label htmlFor="pageSize">Display as</label>
        <Select
          name="pageSize"
          onValueChange={(val) => {
            const urlParams = createQueryString(
              { displayAs: val },
              searchParams.toString(),
            );
            router.push(`${pathname}?${urlParams}`);
          }}
          defaultValue={displayAs}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Images" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="images">Images</SelectItem>
            <SelectItem value="list">List</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
