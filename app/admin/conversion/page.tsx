"use client";

import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useTasks } from "@/lib/queries/admin.hooks";
import { useEffect } from "react";

export default function Component() {
  const { data: tasks, refetch } = useTasks();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 5000);

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="w-full min-h-screen bg-muted/40 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Suivi des conversions</h1>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6">
          {tasks?.map((task) => (
            <>
              <div
                key={task.taskId}
                className="flex items-center justify-between mb-4 gap-4"
              >
                <div>
                  <p className="text-lg w-[200px]">
                    {task.serie} - Saison {task.season} Episode{" "}
                    {task.episodeNumber}
                  </p>
                </div>
                <Progress value={task.progress} />
                <div className="flex items-center">
                  <p className="text-sm mr-2">{task.progress}%</p>
                </div>
              </div>
              {task.taskId !== tasks[tasks.length - 1].taskId && <Separator />}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
