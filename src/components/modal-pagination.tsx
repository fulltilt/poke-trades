"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function ModalPaginationComponent({
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  setPageSize,
}: {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (page: number) => void;
}) {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalCount / pageSize); i++) {
    pageNumbers.push(i);
  }

  const maxPageNum = 7; // Maximum page numbers to display at once
  const pageNumLimit = Math.floor(maxPageNum / 2); // Current page should be in the middle if possible

  const activePages = pageNumbers.slice(
    Math.max(0, currentPage - 1 - pageNumLimit),
    Math.min(currentPage - 1 + pageNumLimit + 1, pageNumbers.length),
  );

  const handleNextPage = () => {
    if (currentPage < pageNumbers.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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
        {/* <PaginationLink onClick={() => createPageURL(page)}> */}
        <PaginationLink onClick={() => setCurrentPage(page)}>
          {page}
        </PaginationLink>
      </PaginationItem>
    ));

    // Add ellipsis at the start if necessary
    if ((activePages?.[0] ?? -Infinity) > 1) {
      renderedPages.unshift(
        <PaginationEllipsis
          key="ellipsis-start"
          onClick={() => setCurrentPage(activePages[0] ?? 0 - 1)}
          className="cursor-pointer"
        />,
      );
    }

    // Add ellipsis at the end if necessary
    if (
      (activePages?.[activePages.length - 1] ?? +Infinity) < pageNumbers.length
    ) {
      renderedPages.push(
        <PaginationEllipsis
          key="ellipsis-end"
          onClick={() =>
            setCurrentPage(activePages[activePages.length - 1] ?? 0 + 1)
          }
          className="cursor-pointer"
        />,
      );
    }

    return renderedPages;
  };

  return (
    <div className="mb-20 flex items-center">
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
      <div className="flex items-center space-x-2">
        <Select onValueChange={(val) => setPageSize(Number(val))}>
          <SelectTrigger className="w-[70px]">
            <SelectValue placeholder="30" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="120">120</SelectItem>
          </SelectContent>
        </Select>
        <p className="min-w-20">per page</p>
      </div>
    </div>
  );
}
