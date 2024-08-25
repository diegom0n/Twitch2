import { db } from "./db";
import { getSelf } from "./auth-service";

export const isBlockedByUser = async (id: string) => {
    try {
        const self = await getSelf();

        const otherUser = await db.user.findUnique({
            where: { id }
        });
        
        if (!otherUser) {
            throw new Error("Usuario no encontrado");
        }

        if (otherUser.id === self.id) {
            return false;
        }

        const existingBlock = await db.block.findUnique({
            where: {
                blockerId_blockedId: {
                    blockerId: otherUser.id,
                    blockedId: self.id,
                },
            },
        });

        return !!existingBlock;
    } catch {
        return false
    }
};

export const blockUser = async (id: string) => {
    const self = await getSelf();

    if (self.id === id) {
        throw new Error("Nao nao");
    }

    const otherUser = await db.user.findUnique({
        where: { id }
    });

    if (!otherUser) {
        throw new Error("User not found")
    }

    const existingBlock = await db.block.findUnique({
        where: {
            blockerId_blockedId: {
                blockerId: self.id,
                blockedId: otherUser.id,
            },
        },
    });
    
    if (existingBlock) {
        throw new Error("Usuario ya se encuentra bloqueado")
    }

    const block = await db.block.create({
        data: {
            blockerId: self.id,
            blockedId: otherUser.id,
        },
        include: {
            blocked: true,
        },
    });

    return block;
};

export const unblockUser = async (id: string) => {
    const self = await getSelf();

    if (self.id === id) {
        throw new Error("Nao nao");
    }

    const otherUser = await db.user.findUnique({
        where: { id },
    });

    if(!otherUser) {
        throw new Error("Usuario no encontrado");
    }

    const existingBlock = await db.block.findUnique({
        where: {
            blockerId_blockedId: {
                blockerId: self.id,
                blockedId: otherUser.id,
            },
        },
    });

    if(!existingBlock) {
        throw new Error("Not blocked");
    }

    const unblock = await db.block.delete({
        where: {
            id: existingBlock?.id,
        },
        include: {
            blocked: true,
        },
    });

    return unblock;
};

export const getBlockedUsers = async () => {
    const self = await getSelf();

    const blockedUsers = await db.block.findMany({
        where: {
            blockerId: self.id,
        },
        include: {
            blocked: true,
        },
    });

    return blockedUsers;
}