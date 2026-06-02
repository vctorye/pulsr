import { Router, Response, Request } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const { userId, date } = req.query;
    const start = new Date(date as string);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date as string);
    end.setUTCHours(23, 59, 59, 999);

    const cardio = await prisma.cardioLog.findMany({
        where: {
            userId: Number(userId),
            completedAt: {gte: start, lte: end}
        }
    })
    res.json(cardio)
})

router.post("/", async (req: Request, res: Response) => {
    const { userId, type, distance, duration, pace, caloriesBurned } = req.body;
    const cardio = await prisma.cardioLog.create({
        data: {
            userId: Number(userId),
            type,
            distance,
            duration,
            pace,
            caloriesBurned,
            completedAt: new Date()
        }
    });
    res.json(cardio);
})

export default router