'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { WatchHistory } from '@/lib/types';

export default function Home() {
  const [resumeWatchings, setResumeWatchings] = useState<WatchHistory[]>([]);

  useEffect(() => {
    fetch('/api/history')
      .then((response) => response.json())
      .then((data) => setResumeWatchings(data));
  }, []);

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
            {resumeWatchings.map((resumeWatching) => (
              <Card key={resumeWatching.id} className="bg-muted rounded-lg overflow-hidden">
                <CardHeader>
                  <Image
                    src={`/api/serie/${resumeWatching.video.season.serie.id}/thumbnail`}
                    alt="Affiche de film 1"
                    width={300}
                    height={450}
                    className="object-cover"
                    style={{ aspectRatio: '300/450', objectFit: 'cover' }}
                  />
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid gap-2">
                    <h3 className="text-lg font-bold">{resumeWatching.video.season.serie.title}</h3>
                    <p className="text-muted-foreground">
                      Saison {resumeWatching.video.season.number}, Episode{' '}
                      {resumeWatching.video.episode}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="link">Reprendre</Button>
                </CardFooter>
              </Card>
            ))}

            {resumeWatchings.length === 0 && (
              <div className="col-span-full text-center">
                <p className="text-lg text-muted-foreground">
                  Vous n'avez pas de série en cours de lecture. <br />
                  Utilisez la fonction de recherche (en haut de l'écran) pour trouver une série à
                  regarder.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
