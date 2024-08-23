"use client";

import { useState } from "react";
import Link from "next/link";

export default function Component() {
  const [searchResults, setSearchResults] = useState([
    { id: 1, title: "Game of Thrones", thumbnail: "/placeholder.svg" },
    { id: 2, title: "Breaking Bad", thumbnail: "/placeholder.svg" },
    { id: 3, title: "The Office", thumbnail: "/placeholder.svg" },
    { id: 4, title: "Stranger Things", thumbnail: "/placeholder.svg" },
    { id: 5, title: "Friends", thumbnail: "/placeholder.svg" },
    { id: 6, title: "Peaky Blinders", thumbnail: "/placeholder.svg" },
    { id: 7, title: "The Wire", thumbnail: "/placeholder.svg" },
    { id: 8, title: "Dexter", thumbnail: "/placeholder.svg" },
    { id: 9, title: "Narcos", thumbnail: "/placeholder.svg" },
    { id: 10, title: "Suits", thumbnail: "/placeholder.svg" },
  ]);
  const handleSearch = (e: { target: { value: string } }) => {
    const query = e.target.value.toLowerCase();
    const results = searchResults.filter((series) =>
      series.title.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };
  return (
    <main className="flex-1 px-4 md:px-6 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {searchResults.map((series) => (
          <div
            key={series.id}
            className="flex flex-col items-center gap-2 group"
          >
            <Link
              href={"/serie/" + series.id}
              className="relative block w-full"
              prefetch={false}
            >
              <img
                src="/placeholder.svg"
                alt={series.title}
                width={300}
                height={450}
                className="w-full h-[450px] object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                style={{ aspectRatio: "300/450", objectFit: "cover" }}
              />
            </Link>
            <div className="text-center">
              <h3 className="font-medium text-base line-clamp-2">
                {series.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
