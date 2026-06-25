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
router.get('/followers', async(req: Request, res:Response) => {
    const { userId } = req.query;
    const following = await prisma.friendship.findMany({
        where: {friendId: Number(userId)},
        include: { user: true }
    });
    res.json(following)
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

    const friendIds = friends.map(f => f.friendId);
    friendIds.push(Number(userId));

    const posts = await prisma.post.findMany({
        where: { userId: { in: friendIds } },
        include: { user: true, meal: true, likes: true, comments: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
    });
    res.json(posts);
})

router.get("/search", async(req: Request, res: Response) => {
    const { q } = req.query;
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: String(q), mode: 'insensitive' } },
                { email: { contains: String(q), mode: 'insensitive' } }
            ]
        }
    })
    res.json(users)
})

export default router
