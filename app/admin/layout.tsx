"use client";
import { FilmIcon, Package2, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentPath = usePathname();
  const pages = [
    {
      title: "Séries",
      href: "/admin/serie",
      icon: FilmIcon,
    },
    {
      title: "Utilisateurs",
      href: "/admin/user",
      icon: User,
    },
  ];

  return (
    <div className="grid min-h-screen w-full overflow-hidden">
      <div className="hidden border-r bg-muted/40 lg:block fixed min-h-[calc(100vh-11rem)]">
        <div className="mt-32 flex flex-col gap-2">
          <div className="flex h-[60px] items-center px-6">
            <Link
              href="#"
              className="flex items-center gap-2 font-semibold"
              prefetch={false}
            >
              <Package2 className="h-6 w-6" />
              <span className="">Administration</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-4 text-sm font-medium">
              {pages.map((page) => (
                <Link
                  key={page.title}
                  href={page.href}
                  className={`${
                    currentPath === page.href ? "text-primary bg-secondary" : ""
                  } flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary`}
                  prefetch={false}
                >
                  <page.icon className="h-4 w-4" />
                  {page.title}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
}
