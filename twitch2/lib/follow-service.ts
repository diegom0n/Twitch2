import { db } from "./db";
import { getSelf } from "./auth-service";

export const getFollowedUsers = async () => {
    try {
        const self = await getSelf();

        const followedUsers = db.follow.findMany({
            where: {
                followerId: self.id,
                following: {
                    blocking: {
                        none: {
                            blockedId: self.id,
                        },
                    },
                },
            },
            include: {
                following: {
                    include: {
                        stream: {
                            select: {
                                isLive: true,
                            },
                        },
                    },
                },
            },
        });

        return followedUsers;
    } catch {
        return []; 
    }
};

export const isFollowingUser = async (id: string) => {
    try {
        const self = await getSelf();

        const otherUser = await db.user.findUnique({
            where: { id },
        });

        if (!otherUser) {
            throw new Error("Usuario no encontrado");
        }

        if (otherUser.id === self.id) {
            return true;
        }

        const existingFollow = await db.follow.findFirst({
            where: {
                followerId: self.id,
                followingId: otherUser.id,
            },
        });

        return !!existingFollow;
    } catch {
        return false;        
    }
};

export const followUser = async (id: string) => {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where: { id },
    });

    if (!otherUser) {
        throw new Error("Usuario no encontrado");
    }

    if (otherUser.id === self.id) {
        throw new Error("No puedes hacer eso");
    }

    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        },
    });

    if (existingFollow) {
        throw new Error("Ya lo sigues");
    }

    const follow = await db.follow.create({
        data: {
            followerId: self.id,
            followingId: otherUser.id,
        },
        include: {
            following: true,
            follower: true,
        },
    });

    return follow;
};

export const unfollowUser = async (id: string) => {
    const self = await getSelf();

    const otherUser = await db.user.findUnique({
        where: {
            id,
        },
    });

    if (!otherUser) {
        throw new Error("Usuario no encontrado");
    }

    if (otherUser.id === self.id) {
        throw new Error("No puedes hacer eso")
    }

    const existingFollow = await db.follow.findFirst({
        where: {
            followerId: self.id,
            followingId: otherUser.id,
        },
    });

    if (!existingFollow) {
        throw new Error("No lo sigues");
    }

    const follow = await db.follow.delete({
        where: {
            id: existingFollow.id,
        },
        include: {
            following: true,
        },
    });

    return follow;
};