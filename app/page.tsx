import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Header from "@/components/header";

export default function Home() {
  return (
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
                  <h3 className="text-lg font-bold">La Cavale de Shawshank</h3>
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
                  <p className="text-muted-foreground">Saison 1, Episode 12</p>
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
                  <h3 className="text-lg font-bold">Le Seigneur des Anneaux</h3>
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
  );
}
