import { Router, Request, Response } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    const { userId, date } = req.query;
    const start = new Date(date as string);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(date as string);
    end.setUTCHours(23, 59, 59, 999);

    const meals = await prisma.meal.findMany({
        where: {
            userId: Number(userId),
            loggedAt: {gte: start, lte: end}
        },
        include: { foodItems: true }
    });
    res.json(meals)
})

router.get('/:fdcId', async (req: Request, res: Response) => {
    const { fdcId } = req.params;

    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${process.env.USDA_API_KEY}`
    )

    const data = await response.json();
    res.json(data);
})

router.delete('/:id', async (req: Request, res: Response) => {
    const id = Number(req.params.id);;
    await prisma.foodItem.delete({ where: { id } });
    res.json({success: true});
})


router.post("/", async (req: Request, res: Response) => {
    const { userId, name, foodItems } = req.body;
    const meal = await prisma.meal.create({
        data: {
            userId: Number(userId),
            name: name,
            loggedAt: new Date(),
            foodItems: {
                create: foodItems
            }
        }
    })
    res.json(meal)
})

export default router