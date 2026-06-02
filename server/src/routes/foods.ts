import { Router, Request, Response } from "express";

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
    const {q} = req.query;

    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${q}&api_key=${process.env.USDA_API_KEY}`
    )
    
    const data = await response.json();

    res.json(data.foods)
})

router.get("/:fdcId", async (req: Request, res: Response) => {
    const { fdcId } = req.params

    const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${process.env.USDA_API_KEY}`
    )

    const data = await response.json();
    res.json(data)
})

export default router
