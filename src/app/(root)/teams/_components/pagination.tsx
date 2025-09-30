interface PaginationProps {
  total_pages: number;
  per_page?: number;
  current_page: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  total_pages,
  per_page = 5,
  current_page,
  onPageChange,
}: PaginationProps) => {
  const totalPages = total_pages;

  // const renderPageButtons = () => {
  //   const buttons = [];

  //   // Add the first page
  //   buttons.push(
  //     <button
  //       key={1}
  //       className={`2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border 2xl:text-[13px] text-[11px] font-gilroySemiBold ${
  //         current_page === 1
  //           ? "bg-black text-white"
  //           : "border-[#F1F1F1] hover:border-black text-[#333333]"
  //       }`}
  //       onClick={() => onPageChange(1)}
  //       aria-label="Page 1"
  //     >
  //       1
  //     </button>
  //   );

  //   // Add ellipsis if necessary
  //   if (current_page > 3) {
  //     buttons.push(
  //       <span
  //         key="start-ellipsis"
  //         className="2xl:w-8 h-7 w-7 flex justify-center items-center text-[#333333]"
  //       >
  //         ...
  //       </span>
  //     );
  //   }

  //   // Add current page and neighbors
  //   const rangeStart = Math.max(2, current_page - 1);
  //   const rangeEnd = Math.min(totalPages - 1, current_page + 1);

  //   for (let i = rangeStart; i <= rangeEnd; i++) {
  //     buttons.push(
  //       <button
  //         key={i}
  //         className={`2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border 2xl:text-[13px] text-[11px] font-gilroySemiBold ${
  //           current_page === i
  //             ? "bg-black text-white"
  //             : "border-[#F1F1F1] hover:border-black text-[#333333]"
  //         }`}
  //         onClick={() => onPageChange(i)}
  //         aria-label={`Page ${i}`}
  //       >
  //         {i}
  //       </button>
  //     );
  //   }

  //   // Add ellipsis if necessary
  //   if (current_page < totalPages - 2) {
  //     buttons.push(
  //       <span
  //         key="end-ellipsis"
  //         className="2xl:w-8 h-7 w-7 flex justify-center items-center text-[#333333]"
  //       >
  //         ...
  //       </span>
  //     );
  //   }

  //   // Add the last page
  //   buttons.push(
  //     <button
  //       key={totalPages}
  //       className={`2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border 2xl:text-[13px] text-[11px] font-gilroySemiBold ${
  //         current_page === totalPages
  //           ? "bg-black text-white"
  //           : "border-[#F1F1F1] hover:border-black text-[#333333]"
  //       }`}
  //       onClick={() => onPageChange(totalPages)}
  //       aria-label={`Page ${totalPages}`}
  //     >
  //       {totalPages}
  //     </button>
  //   );

  //   return buttons;
  // };

  const renderPageButtons = () => {
    if (totalPages === 1) {
      return (
        <button
          key={1}
          className="2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border bg-black text-white font-gilroySemiBold"
          aria-label="Page 1"
        >
          1
        </button>
      );
    }

    const buttons = [];

    // Add the first page
    buttons.push(
      <button
        key={1}
        className={`2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border 2xl:text-[13px] text-[11px] font-gilroySemiBold ${
          current_page === 1
            ? "bg-black text-white"
            : "border-[#F1F1F1] hover:border-black text-[#333333]"
        }`}
        onClick={() => onPageChange(1)}
        aria-label="Page 1"
      >
        1
      </button>
    );

    // Add ellipsis if necessary
    if (current_page > 3) {
      buttons.push(
        <span
          key="start-ellipsis"
          className="2xl:w-8 h-7 w-7 flex justify-center items-center text-[#333333]"
        >
          ...
        </span>
      );
    }

    // Add current page and neighbors
    const rangeStart = Math.max(2, current_page - 1);
    const rangeEnd = Math.min(totalPages - 1, current_page + 1);

    for (let i = rangeStart; i <= rangeEnd; i++) {
      buttons.push(
        <button
          key={i}
          className={`2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border 2xl:text-[13px] text-[11px] font-gilroySemiBold ${
            current_page === i
              ? "bg-black text-white"
              : "border-[#F1F1F1] hover:border-black text-[#333333]"
          }`}
          onClick={() => onPageChange(i)}
          aria-label={`Page ${i}`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis if necessary
    if (current_page < totalPages - 2) {
      buttons.push(
        <span
          key="end-ellipsis"
          className="2xl:w-8 h-7 w-7 flex justify-center items-center text-[#333333]"
        >
          ...
        </span>
      );
    }

    // Add the last page
    buttons.push(
      <button
        key={totalPages}
        className={`2xl:w-8 2xl:h-8 h-7 w-7 leading-none flex justify-center items-center rounded-full border 2xl:text-[13px] text-[11px] font-gilroySemiBold ${
          current_page === totalPages
            ? "bg-black text-white"
            : "border-[#F1F1F1] hover:border-black text-[#333333]"
        }`}
        onClick={() => onPageChange(totalPages)}
        aria-label={`Page ${totalPages}`}
      >
        {totalPages}
      </button>
    );

    return buttons;
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full">
      <button
        className="2xl:size-8 size-7 flex justify-center leading-none items-center rounded-full border border-[#F1F1F1] hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(1)}
        disabled={current_page === 1}
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        className="2xl:size-8 size-7 flex leading-none justify-center items-center rounded-full border border-[#F1F1F1] hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.max(current_page - 1, 1))}
        disabled={current_page === 1}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>

      {renderPageButtons()}

      <button
        className="2xl:size-8 size-7 leading-none flex justify-center items-center rounded-full border border-[#F1F1F1] hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(Math.min(current_page + 1, totalPages))}
        disabled={current_page === totalPages}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <button
        className="2xl:size-8 size-7 leading-none flex justify-center items-center rounded-full border border-[#F1F1F1] hover:border-black disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(totalPages)}
        disabled={current_page === totalPages}
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
};

export default Pagination;
