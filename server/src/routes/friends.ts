import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async(req: Request, res: Response) => {
    const { userId } = req.query;
    const friends = await prisma.friendship.findMany({
        where: { userId: Number(userId) },
        include: { friend: true }
    });
    res.json(friends);
})

router.post("/", async(req: Request, res: Response) => {
    const { userId, friendId } = req.body;
    const friendship = await prisma.friendship.create({
        data: {
            userId: Number(userId),
            friendId: Number(friendId)
        }
    })
    res.json(friendship)
})

router.get("/feed", async(req: Request, res: Response) => {
    const { userId } = req.query;
    const friends = await prisma.friendship.findMany({
        where: { userId: Number(userId) },
        include: { friend: true }
    });

    const friendIds = friends.map(f => f.friendId);      // ← map over it here

    const posts = await prisma.post.findMany({
        where: { userId: { in: friendIds } },
        include: { user: true, meal: true },
        orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
})

export default router
