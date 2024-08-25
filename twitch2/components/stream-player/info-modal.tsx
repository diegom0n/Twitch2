"use client";

import { toast } from "sonner";
import { useState, useTransition, useRef, ElementRef } from "react";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { updateStream } from "@/actions/stream";
import { UploadDropzone } from "@/lib/uploadthing";
import { Hint } from "../hint";
import { Trash } from "lucide-react";
import Image from "next/image";

interface InfoModalProps {
    initialName: string;
    initialThumbnailUrl: string | null;
};

export const InfoModal = ({
    initialName,
    initialThumbnailUrl
}: InfoModalProps) => {
    const router = useRouter();
    const closeRef = useRef<ElementRef<"button">>(null);
    const [isPending, startTransition] = useTransition();


    const [name, setName] = useState(initialName);
    const [thumbnailUrl, setThumbnailUrl] = useState(initialThumbnailUrl);

    const onRemove = () => {
        startTransition(() => {
            updateStream({ thumbnailUrl: null })
                .then(() => {
                    toast.success("Miniatura eliminada");
                    setThumbnailUrl("");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Algo ha salido mal"));
        });
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        startTransition(() => {
            updateStream({ name: name })
                .then(() => {
                    toast.success("Stream actualizado");
                    closeRef?.current?.click();
                })
                .catch(() => toast.error("Algo ha salido mal"))
        });
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" size="sm" className="ml-auto">
                    Editar
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Editar información
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-14">
                    <div className="space-y-2">
                        <Label>
                            Nombre
                        </Label>
                        <Input 
                            disabled={isPending}
                            placeholder="Nombre del stream"
                            onChange={onChange}
                            value={name}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>
                            Miniatura
                        </Label>
                        {thumbnailUrl ? (
                            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10">
                                <div className="absolute top-2 right-2 z-[10]">
                                    <Hint label="Eliminar miniatura" asChild side="left">
                                        <Button
                                            type="button"
                                            disabled={isPending}
                                            onClick={onRemove}
                                            className="h-auto w-auto p-1.5"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </Hint>
                                </div>
                                <Image
                                    alt="Miniatura del stream"
                                    src={thumbnailUrl}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                        <div className="rounded-xl border outline-dashed outline-muted">
                            <UploadDropzone
                                endpoint="thumbnailUploader"
                                appearance={{
                                    label: {
                                        color: "#FFFFFF"
                                    },
                                    allowedContent: {
                                        color: "#FFFFFF"
                                    }
                                }}
                                onClientUploadComplete={(res) => {
                                    setThumbnailUrl(res?.[0]?.url);
                                    router.refresh();
                                    closeRef?.current?.click();
                                }}
                            />
                        </div>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <DialogClose ref={closeRef} asChild>
                            <Button type="button" variant="ghost">
                                Cancelar
                            </Button>
                        </DialogClose>
                        <Button
                            disabled={isPending}
                            variant="primary"
                            type="submit"
                        >
                            Guardar
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};