"use client";
import { Error400 } from "@/components/errors/Error400";
import { Error401 } from "@/components/errors/Error401";
import { Error404 } from "@/components/errors/Error404";
import { Error500 } from "@/components/errors/Error500";
import { useEffect } from "react";

export default function GlobalError({ error }) {
  useEffect(() => {
    console.log("App Error:", error);
  }, [error]);

  const status = parseInt(error.message.match(/\d+/)?.[0], 10) || 500;
  console.log("🚀 ~ GlobalError ~ status:", status);

  return (
    <html>
      <body className="flex items-center justify-center h-screen bg-gray-100">
        {status === 400 && <Error400 />}
        {status === 401 && <Error401 />}
        {status === 404 && <Error404 />}
        {status === 500 && <Error500 />}
        {!status && <Error500 />}
      </body>
    </html>
  );
}
