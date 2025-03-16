"use client";

import { Loader2 } from "lucide-react";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 bg-gray-900 opacity-60 flex items-center justify-center z-50">
      <Loader2 className="w-12 h-12 animate-spin text-white" />
    </div>
  );
};

export default FullScreenLoader;
