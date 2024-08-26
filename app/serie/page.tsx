"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Serie } from "@/lib/types";

export default function Component() {
  const [series, setSeries] = useState<Serie[]>([]);
  useEffect(() => {
    fetch("/api/serie")
      .then((res) => res.json())
      .then(setSeries);
  }, []);
  return (
    <main className="flex-1 px-4 md:px-6 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {series.map((serie) => (
          <div
            key={serie.id}
            className="flex flex-col items-center gap-2 group"
          >
            <Link
              href={"/serie/" + serie.id}
              className="relative block w-full"
              prefetch={false}
            >
              <img
                src={`/api/serie/${serie.id}/thumbnail`}
                alt={serie.title}
                width={300}
                height={450}
                className="w-full h-[450px] object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                style={{ aspectRatio: "300/450", objectFit: "cover" }}
              />
            </Link>
            <div className="text-center">
              <h3 className="font-medium text-base line-clamp-2">
                {serie.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
