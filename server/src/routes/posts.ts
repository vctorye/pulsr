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

export default router