import { currentUser } from "@clerk/nextjs";

import { db } from "./db";

export const getSelf = async () => {
    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("No compare ✋");
    }

    const user = await db.user.findUnique({
        where: { externalUserId: self.id },
    });

    if (!user) {
        throw new Error("No encontrado");
    }

    return user;
};

export const getSelfByUsername = async (username: string) => {
    const self = await currentUser();

    if (!self || !self.username) {
        throw new Error("No compare ✋");
    }

    const user = await db.user.findUnique({
        where: { username }
    });

    if (!user) {
        throw new Error("Usuario no encontrado")
    }

    if (self.username !== user.username) {
        throw new Error("No compare ✋");
    }

    return user;
};