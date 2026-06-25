import { Router, Response, Request } from "express";
import prisma from "../prisma";

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { postId, userId } = req.body 
    const like = await prisma.like.create({
        data: {
        userId: Number(userId),
        postId
        }
    });
    res.json(like)
})

router.delete('/:id', async(req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.like.delete({where: {id}})
    res.json({success: true})
})

export default router 
