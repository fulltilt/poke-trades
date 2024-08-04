"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 30;

  return (
    <div className="flex gap-8">
      <div className="flex items-center gap-2">
        <label htmlFor="order">Order By</label>
        <Select
          name="order"
          onValueChange={(val) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", currentPage.toString());
            params.set("pageSize", pageSize.toString());
            params.set("orderBy", val);
            router.replace(`${pathname}?${params.toString()}`);
          }}
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
      <div className="flex items-center gap-2">
        <label htmlFor="pageSize">Show</label>
        <Select
          name="pageSize"
          onValueChange={(val) => {
            const params = new URLSearchParams(searchParams);
            params.set("page", currentPage.toString());
            params.set("pageSize", val);
            router.replace(`${pathname}?${params.toString()}`);
          }}
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
    </div>
  );
}
