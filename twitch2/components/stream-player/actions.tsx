"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "../ui/button";



interface ActionsProps {
    hostIdentity: string;
    isFollowing: boolean;
    isHost: boolean;
};

export const Actions = ({
    hostIdentity,
    isFollowing,
    isHost,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();
    const { userId } = useAuth();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(hostIdentity)
                .then((data) => toast.success(`No sigues a ${data.following.username}`))
                .catch(() => toast.error("Algo ha salido mal"))
        });
    }

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(hostIdentity)
                .then((data) => toast.success(`Dejaste de seguir a ${data.following.username}`))
                .catch(() => toast.error("Algo ha salido mal"))
        });
    }


    const toggleFollow = () => {
        if (!userId) {
            return router.push("/sign-in");
        }

        if (isHost) return;

        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }

    return (
        <Button
            disabled={isPending || isHost}
            onClick={toggleFollow}
            variant="primary"
            size="sm"
            className="w-full lg:w-auto"
        >
            <Heart className={cn(
                "h-4 w-4 mr-2",
                isFollowing 
                    ? "fill-white"
                    : "fill-none" 
            )} />
            {isFollowing
                ? "Dejar de seguir"
                : "Seguir"
            }
        </Button>
    )
};

export const ActionsSkeleton = () => {
    return (
        <Skeleton className="h-10 w-full lg:w-24" />
    );
};