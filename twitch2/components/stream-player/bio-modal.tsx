"use client";

import { useState, useTransition, useRef, ElementRef } from "react";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { updateUser } from "@/actions/user";
import { toast } from "sonner";

interface BioModalProps {
    initialValue: string | null;
};

export const BioModal = ({
    initialValue,
}: BioModalProps) => {
    const closeRef = useRef<ElementRef<"button">>(null);

    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(initialValue || "");

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(() => {
            updateUser({ bio: value })
                .then(() => {
                    toast.success("Biografiía actualizada");
                    closeRef.current?.click();
                })
                .catch(() => toast.error("Algo salió mal"));
        });
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="ml-auto">
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar biografía</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <Textarea 
                        placeholder="User bio"
                        onChange={(e) => setValue(e.target.value)}
                        value={value}
                        disabled={isPending}
                        className="resize-none"
                    />
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            disabled={isPending}
                            type="submit"
                            variant="primary"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};