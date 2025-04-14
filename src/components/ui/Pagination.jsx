import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const Pagination = ({ total, limit }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const totalPages = Math.ceil(total / limit);

  const onPageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPages = () => {
    const pages = [];
    const maxPageDisplay = 5;
    const half = Math.floor(maxPageDisplay / 2);
    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    if (currentPage <= half + 1) {
      start = 2;
      end = Math.min(totalPages - 1, maxPageDisplay);
    } else if (currentPage >= totalPages - half) {
      start = Math.max(2, totalPages - maxPageDisplay + 1);
      end = totalPages - 1;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const pages = getPages();

  return (
    <div className="flex items-center gap-2 justify-center mt-6 flex-wrap">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft />
      </Button>

      <Button
        variant={currentPage === 1 ? "default" : "outline"}
        size="sm"
        onClick={() => onPageChange(1)}
      >
        1
      </Button>

      {pages[0] > 2 && <span className="px-1">...</span>}

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {pages[pages.length - 1] < totalPages - 1 && <span className="px-1">...</span>}

      {totalPages > 1 && (
        <Button
          variant={currentPage === totalPages ? "default" : "outline"}
          size="sm"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </Button>
      )}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon"
        className="rounded-full"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
