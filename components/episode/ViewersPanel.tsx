import { Viewer } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserIcon } from "lucide-react";

export default function ViewersPanel({ viewers }: { viewers: Viewer[] }) {
  return (
    <Card className="h-fit lg:sticky lg:top-6">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Visionnages en cours</h2>
        <p className="text-sm text-muted-foreground">3 utilisateurs</p>
      </div>
      <ScrollArea className="h-[400px] p-4">
        <div className="space-y-4">
          {viewers.map((viewer) => (
            <div
              key={viewer.id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserIcon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">{viewer.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Durée: {viewer.watchTime}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
