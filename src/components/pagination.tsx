"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

export default function PaginationComponent({
  totalCount,
}: {
  totalCount: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const currentPage = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 30;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const params = new URLSearchParams(searchParams);
  const path = pathname.split("/");

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / pageSize); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 5; // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      createPageURL(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      createPageURL(currentPage - 1);
    }
  };

  // Function to render page numbers with ellipsis
  const renderPages = () => {
    const renderedPages = activePages.map((page, idx) => (
      <PaginationItem
        key={idx}
        className={
          currentPage === page
            ? "cursor-pointer rounded-md bg-neutral-100"
            : "cursor-pointer"
        }
      >
        <PaginationLink onClick={() => createPageURL(page)}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if (activePages && activePages[0] && activePages[0] > 1) {
      // if (activePages?.[0] ?? -Infinity > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => createPageURL(activePages[0] ?? 0 - 1)}
          className="cursor-pointer"
        />,
      );
    }

    // Add ellipsis at the end if necessary
    // if (
    //   activePages?.[activePages.length - 1] ??
    //   +Infinity < pageNumbers.length
    // ) {
    if (activePages?.[activePages.length - 1]! < pageNumbers.length) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            createPageURL(activePages[activePages.length - 1] ?? 0 + 1)
          }
          className="cursor-pointer"
        />,
      );
    }

    return renderedPages;
  };

  return (
    <div className="mb-20">
      <Pagination>
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious onClick={handlePrevPage} />
          </PaginationItem>
          {renderPages()}
          <PaginationItem className="cursor-pointer">
            <PaginationNext onClick={handleNextPage} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
