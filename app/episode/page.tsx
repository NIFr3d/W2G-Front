"use client";

import { useRouter } from "next/navigation";
import { useLayoutEffect } from "react";

export default function Page() {
  const router = useRouter();

  useLayoutEffect(() => {
    router.replace("/");
  }, [router]);
  return (
    <div>
      <h1>Veuillez sélectionner un épisode</h1>
    </div>
  );
}
