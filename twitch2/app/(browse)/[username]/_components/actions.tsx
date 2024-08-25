"use client";

import { useTransition } from "react";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { onBlock, onUnBlock } from "@/actions/block";

interface ActionsProps {
    isFollowing: boolean;
    userId: string;
};

export const Actions = ({
    isFollowing,
    userId,
}: ActionsProps) => {
    const [isPending, startTransition] = useTransition();

    const handleFollow = () => {
        startTransition(() => {
            onFollow(userId)
                .then((data) => toast.success(`Ahora sigues a ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"));
        });
    };

    const handleUnfollow = () => {
        startTransition(() => {
            onUnfollow(userId)
                .then((data) => toast.success(`Dejaste de seguir a ${data.following.username}`))
                .catch(() => toast.error("Something went wrong"));
        });
    };

    const onClick = () => {
        if (isFollowing) {
            handleUnfollow();
        } else {
            handleFollow();
        }
    }

    const handleBlock = () => {
        startTransition(() => {
            onUnBlock(userId)
             .then((data) => toast.success(`Bloqueaste a ${data.blocked.username}`))
             .catch(() => toast.error("Something went wrong :("))
        })
    }
    //    const handleBlock = () => {
    //    startTransition(() => {
    //        onUnBlock(userId)
    //         .then((data) => toast.success(`Desbloqueaste a ${data.blocked.username} 🙂👍`))
    //         .catch(() => toast.error("Something went wrong :("))
    //    })
    // } 

    return (
        <>
        <Button 
        disabled={isPending} 
        onClick={onClick} 
        variant="primary"
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
        <Button onClick={handleBlock} disabled={isPending}>
            Bloquear
        </Button>
        </>
    );
};