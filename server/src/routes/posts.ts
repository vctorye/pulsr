import { Router, Response, Request } from "express";
import prisma from "../prisma";

const router = Router();

router.post('/', async(req:Request, res: Response) => {
    const { userId, type, caption, description, mealId, photoUrl } = req.body;
    const post = await prisma.post.create({
        data: {
            userId: Number(userId),
            type,
            caption,
            description,
            mealId,
            photoUrl
        }
    });
    res.json(post);
})

router.get('/', async(req: Request, res:Response) => {
    const {userId} = req.query;
        console.log('userId:', userId)

    const posts = await prisma.post.findMany({
        where: { userId: Number(userId) },
        orderBy: {createdAt: 'desc'},
        include: { user: true }

    });
    res.json(posts)
})

export default router