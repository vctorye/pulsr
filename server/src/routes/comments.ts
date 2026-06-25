import { Router, Response, Request } from "express";
import prisma from "../prisma";

const router = Router();

router.post('/', async (req: Request, res: Response) => {
    const { postId, userId, text } = req.body 
    const comment = await prisma.comment.create({
        data: {
        userId: Number(userId),
        postId,
        text
        }
    });
    res.json(comment)
})

router.delete('/:id', async(req: Request, res: Response) => {
    const id = Number(req.params.id);
    await prisma.comment.delete({where: {id}})
    res.json({success: true})
})

export default router 
