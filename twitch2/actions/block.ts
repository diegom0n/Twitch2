 "use server";

import { revalidatePath } from "next/cache";

import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/block-service";
import { RoomServiceClient } from "livekit-server-sdk";

const roomService = new RoomServiceClient(
    process.env.LIVEKIT_API_URL!,
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
);

 export const onBlock = async (id: string) => {
    const self = await getSelf();

    let blockedUser;

    try {
        blockedUser = await blockUser(id);
    } catch {
        // El usuario es un invitado
    }

    try {
        await roomService.removeParticipant(self.id, id);
    } catch {
        // El usuario no está en la sala
    }

    revalidatePath(`/u/${self.username}/community`);

    return blockedUser;
 };

 export const onUnBlock = async (id: string) => {
    const unblockedUser = await unblockUser(id);

    revalidatePath("/");

    if (unblockedUser) {
        revalidatePath(`/${unblockedUser.blocked.username}`);
    }

    return unblockedUser;
 };