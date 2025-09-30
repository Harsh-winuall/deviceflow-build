import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

interface PaginationProps {
  page: number;
  pageLimit: number;
  total: number;
  items: any[];
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageLimitChange: (limit: number) => void;
  className?: string;
}

export const Pagination = ({
  page,
  pageLimit,
  total,
  items,
  totalPages,
  onPageChange,
  onPageLimitChange,
  className = "",
}: PaginationProps) => {
  const handlePrevious = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <>
      {total !== 0 ? (
        <div
          className={`flex items-center justify-between font-gilroyRegular ${className}`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 font-gilroyRegular">
              Rows per page:
            </span>
            <Select
              value={pageLimit.toString()}
              onValueChange={(value) => {
                onPageLimitChange(Number(value));
                onPageChange(1); // Reset to first page when changing page size
              }}
            >
              <SelectTrigger className="w-20 h-8 font-gilroyRegular">
                <SelectValue placeholder={pageLimit} />
              </SelectTrigger>
              <SelectContent className="font-gilroyMedium">
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="200">200</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 font-gilroyMedium">
              {items?.length ? (page - 1) * pageLimit + 1 : 0} -{" "}
              {Math.min(page * pageLimit, total || 0)} of {total || 0}
            </span>

            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                disabled={page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-100 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export const PaginationSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "flex items-center justify-between  font-gilroyRegular",
      className
    )}
  >
    <div className="flex items-center gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20" />
    </div>

    <div className="flex items-center gap-4">
      <Skeleton className="h-4 w-24" />

      <div className="flex gap-2">
        <Skeleton className="h-7 w-10" />
        <Skeleton className="h-7 w-10" />
      </div>
    </div>
  </div>
);
