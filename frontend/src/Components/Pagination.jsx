import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first, last, and pages around current
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push("ellipsis");
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = totalPages - 3; i <= totalPages; i++)
                    pages.push(i);
            } else {
                pages.push(1);
                pages.push("ellipsis");
                for (let i = currentPage - 1; i <= currentPage + 1; i++)
                    pages.push(i);
                pages.push("ellipsis");
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Scroll to top when page changes. Can be made optional if needed.
    const handlePageClick = (page) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className={`flex items-center justify-center space-x-2 my-8 ${className}`}
        >
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl transition-all duration-300 ${
                    currentPage === 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
                aria-label="Previous page"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) =>
                    page === "ellipsis" ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="w-10 h-10 flex items-center justify-center text-slate-400"
                        >
                            <MoreHorizontal size={16} />
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageClick(page)}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${
                                currentPage === page
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                            }`}
                        >
                            {page}
                        </button>
                    ),
                )}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-xl transition-all duration-300 ${
                    currentPage === totalPages
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
                aria-label="Next page"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};
