"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import { MAPPING_BREADCRUMBS } from "@/app/shared/restaurants";

export const Breadcrumbs = ({ labelMap }) => {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean);

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");

    const labelMapping = {
      ...MAPPING_BREADCRUMBS,
      ...labelMap,
    };

    const label =
      labelMapping[segment] ||
      decodeURIComponent(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

    return (
      <span key={href} className="flex items-center gap-1 text-sm text-gray-600">
        <span>/</span>
        <Link
          href={href}
          className={`hover:underline capitalize ${
            index === pathSegments.length - 1 ? "font-bold" : ""
          }`}
        >
          {label}
        </Link>
      </span>
    );
  });

  return (
    <nav className="flex items-center gap-1 py-4">
      <Link href="/" className="text-gray-600 hover:text-black">
        <Home size={18} />
      </Link>
      {breadcrumbs}
    </nav>
  );
};
