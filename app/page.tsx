import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { CircleUser } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="bg-muted px-4 lg:px-6 h-14 flex items-center">
        <Link
          href="#"
          className="flex items-center justify-center"
          prefetch={false}
        >
          <span className="text-lg font-bold">W2G</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            prefetch={false}
          >
            Toutes les séries
          </Link>
          <div className="relative flex-1 md:grow-0">
            <div className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
            />
          </div>
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
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Paramètres</DropdownMenuItem>
              <DropdownMenuItem>Assistance</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container grid gap-12 px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Reprendre la lecture
                </h2>
              </div>
            </div>
            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <Card className="bg-muted rounded-lg overflow-hidden">
                <CardHeader>
                  <Image
                    src="/placeholder.svg"
                    alt="Affiche de film 1"
                    width={300}
                    height={450}
                    className="object-cover"
                    style={{ aspectRatio: "300/450", objectFit: "cover" }}
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-bold">
                      La Cavale de Shawshank
                    </h3>
                    <p className="text-muted-foreground">Saison 1, Episode 5</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="link">Reprendre</Button>
                </CardFooter>
              </Card>
              <Card className="bg-muted rounded-lg overflow-hidden">
                <CardHeader>
                  <Image
                    src="/placeholder.svg"
                    alt="Affiche de film 2"
                    width={300}
                    height={450}
                    className="object-cover"
                    style={{ aspectRatio: "300/450", objectFit: "cover" }}
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-bold">Inception</h3>
                    <p className="text-muted-foreground">Saison 2, Episode 8</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="link">Reprendre</Button>
                </CardFooter>
              </Card>
              <Card className="bg-muted rounded-lg overflow-hidden">
                <CardHeader>
                  <Image
                    src="/placeholder.svg"
                    alt="Affiche de film 3"
                    width={300}
                    height={450}
                    className="object-cover"
                    style={{ aspectRatio: "300/450", objectFit: "cover" }}
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-bold">The Dark Knight</h3>
                    <p className="text-muted-foreground">
                      Saison 1, Episode 12
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="link">Reprendre</Button>
                </CardFooter>
              </Card>
              <Card className="bg-muted rounded-lg overflow-hidden">
                <CardHeader>
                  <Image
                    src="/placeholder.svg"
                    alt="Affiche de film 4"
                    width={300}
                    height={450}
                    className="object-cover"
                    style={{ aspectRatio: "300/450", objectFit: "cover" }}
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-bold">
                      Le Seigneur des Anneaux
                    </h3>
                    <p className="text-muted-foreground">Saison 3, Episode 4</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="link">Reprendre</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="bg-muted p-6 md:py-12 w-full shrink-0">
        <div className="container max-w-7xl text-sm">
          <p>&copy; 2024 Fred</p>
        </div>
      </footer>
    </div>
  );
}
