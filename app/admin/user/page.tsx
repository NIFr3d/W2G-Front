"use client";

import UpsertUserDialog from "@/components/admin/UpsertUserDialog";
import CustomAlertDialog from "@/components/general/customalertdialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useDeleteUser, useUsers } from "@/lib/queries/admin.hooks";
import { User } from "@/lib/types";
import { Check, Edit, Trash, X } from "lucide-react";
import { useCallback, useState } from "react";

export default function Page() {
  const { toast } = useToast();

  const { data: users } = useUsers();
  const { mutate: deleteUser } = useDeleteUser();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState<User | undefined>();

  const handleDeleteUser = useCallback((id: number) => {
    deleteUser(id, {
      onSuccess: () => {
        toast({
          title: "Succès",
          description: "L'utilisateur a été supprimé avec succès",
        });
      },
      onError: (error) => {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  }, []);

  return (
    <div className="w-full bg-muted/40 py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        </div>
        <div className="bg-background rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4 gap-4">
            <div>
              <p className="text-lg w-[200px]">Utilisateurs</p>
            </div>
            <div className="flex">
              <Button
                onClick={() => {
                  setUserToUpdate(undefined);
                  setIsDialogOpen(true);
                }}
              >
                Ajouter
              </Button>
            </div>
          </div>
          <div className="flex justify-between mb-4 gap-4">
            <div className="flex w-[400px]">
              <p className="text-sm">Nom d'utilisateur</p>
            </div>
            <div className="flex w-[60px]">
              <p className="text-sm mr-2">Admin ?</p>
            </div>
            <div className="flex">
              <p className="text-sm mr-2">Actions</p>
            </div>
          </div>
          {users?.map((user) => (
            <div key={user.id} className="flex justify-between mb-4 gap-4">
              <div className="flex w-[400px]">
                <p className="text-sm">{user.username}</p>
              </div>
              <div className="flex w-[60px]">
                <p className="text-sm mr-2">
                  {user.role === "ADMIN" ? (
                    <Check className="text-green-500" />
                  ) : (
                    <X className="text-red-500" />
                  )}
                </p>
              </div>
              <div className="flex">
                <button
                  onClick={() => {
                    setUserToUpdate(user);
                    setIsDialogOpen(true);
                  }}
                >
                  <Edit className="pt-[2px]" />
                </button>
                <CustomAlertDialog
                  title="Supprimer l'utilisateur"
                  description="Etes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
                  variant="destructive"
                  icon={<Trash className="text-red-500" />}
                  onConfirm={() => handleDeleteUser(user.id ?? -1)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {isDialogOpen && (
        <UpsertUserDialog
          user={userToUpdate}
          onClose={() => {
            setUserToUpdate(undefined);
            setIsDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
