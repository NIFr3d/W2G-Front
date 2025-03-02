"use client";

import Link from "next/link";
import { CircleUser } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useCallback, useEffect, useState } from "react";
import { useSeries } from "@/lib/queries/serie.hooks";

export default function Header() {
  const router = useRouter();
  const cookies = useCookies();
  const username = cookies.get("username");
  const role = cookies.get("role");

  const handleLogOut = async () => {
    await fetch("/api/auth/logout");
    cookies.remove("token");
    cookies.remove("username");
    cookies.remove("role");
    router.push("/login");
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [displaySearchResults, setDisplaySearchResults] = useState(false);

  const { data: series } = useSeries({
    search: searchTerm,
    enabled: displaySearchResults,
  });

  const handleFocus = useCallback(
    () => setDisplaySearchResults(searchTerm.length > 0),
    [searchTerm]
  );

  const handleBlur = useCallback(
    () => setTimeout(() => setDisplaySearchResults(false), 200),
    [searchTerm]
  );

  const handleConfirmSearch = useCallback(() => {
    if (series?.length === 1) {
      router.push(`/serie/${series[0].id}`);
    } else if ((series?.length ?? 0) > 1 && searchTerm.length > 0) {
      router.push(`/serie?search=${searchTerm}`);
    } else {
      return;
    }
    setDisplaySearchResults(false);
    setSearchTerm("");
  }, [series, searchTerm, router]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setDisplaySearchResults(true);
    } else {
      setDisplaySearchResults(false);
    }
  }, [searchTerm]);

  return (
    <header className="bg-muted px-4 lg:px-6 h-[60px] flex items-center">
      <div className="w-72">
        <Link
          href="/"
          className="flex items-start justify-start"
          prefetch={false}
        >
          <span className="text-lg font-bold">W2G</span>
        </Link>
      </div>
      {username && (
        <>
          <div className="relative flex-1 md:grow-0 mx-auto">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[500px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleConfirmSearch();
                }
              }}
            />
            {displaySearchResults && (
              <div className="absolute top-full left-0 w-full bg-background rounded-b-lg shadow-lg z-10 mt-2">
                <ul className="py-2 grid grid-cols-1 gap-2 p-2">
                  {series?.map((serie) => (
                    <li key={serie.id} className="flex items-center">
                      <Link
                        href={`/serie/${serie.id}`}
                        className="flex items-center rounded-lg overflow-hidden w-full"
                        prefetch={false}
                      >
                        <img
                          src={`/api/serie/${serie.id}/thumbnail`}
                          alt={serie.title}
                          width={100}
                          height={75}
                          className="aspect-video object-cover w-16 h-24 mr-4"
                        />
                        <div className="flex-1 text-sm font-medium line-clamp-1 py-2 px-4 w-full h-full">
                          {serie.title}
                        </div>
                      </Link>
                    </li>
                  ))}
                  {typeof series === "undefined" ||
                    (series?.length === 0 && (
                      <li className="align-center text-center text-sm">
                        Aucun résultat
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 w-72">
            <Link
              href="/serie"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
              prefetch={false}
            >
              Toutes les séries
            </Link>
            {role === "ADMIN" && (
              <Link
                href="/admin"
                className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium shadow transition-colors hover:bg-destructive/90 text-primary-foreground"
                prefetch={false}
              >
                Admin
              </Link>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="overflow-hidden rounded-full"
                >
                  <CircleUser />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{username}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Paramètres</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogOut}>
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </header>
  );
}
