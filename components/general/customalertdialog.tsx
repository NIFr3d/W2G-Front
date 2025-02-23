"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function CustomAlertDialog({
  variant,
  title,
  description,
  disabled,
  icon,
  onConfirm,
}: {
  variant: "destructive";
  title: string;
  description: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {typeof icon === "undefined" ? (
          <Button variant={variant}>
            {variant === "destructive" ? "Supprimer" : "Confirmer"}
          </Button>
        ) : (
          <button>{icon}</button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button variant={variant} onClick={onConfirm} disabled={disabled}>
              {variant === "destructive" ? "Supprimer" : "Confirmer"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
