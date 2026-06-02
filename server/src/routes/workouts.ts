import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/",  async (req: Request, res: Response) => {
    const { userId, date } = req.query;
    const start = new Date(date as string);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date as string);
    end.setUTCHours(23, 59, 59, 999);
    const workouts = await prisma.workout.findMany({
        where: {
            userId: Number(userId),
            completedAt: { gte: start, lte: end }
        },
        include: { exercises: true }
    });
    res.json(workouts);
})

router.post("/", async (req: Request, res: Response) => {
    const { userId, name, type, exercises } = req.body;
    const workout = await prisma.workout.create({
        data: {
            userId: Number(userId),
            name,
            type,
            completedAt: new Date(),
            exercises: {
                create: exercises
            }
        }
    });
    res.json(workout);
})

router.delete("/:id", async (req: Request, res: Response) => {
    const id = Number(req.params.id);;
    await prisma.exercise.delete({ where: { id } })
    res.json({success: true}) 
})


export default router