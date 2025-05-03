
import React from "react";

interface ProductPaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export function ProductPagination({ totalPages, currentPage, onPageChange }: ProductPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-4 shadow-md">
      <div className="flex justify-center">
        <div className="flex gap-2">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`h-8 w-8 flex items-center justify-center rounded-full ${
                currentPage === i + 1
                  ? "bg-pink-500 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
