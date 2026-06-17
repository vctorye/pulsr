import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get("/search", async (req, res) => {
    const { q, userId } = req.query;
    const users = await prisma.user.findMany({
        where: {
            AND: [
                { id: { not: Number(userId) } },
                {
                    OR: [
                        { name: { contains: String(q), mode: 'insensitive' } },
                        { email: { contains: String(q), mode: 'insensitive' } }
                    ]
                }
            ]
        }
    });
    res.json(users);
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.json(user);
});

router.post("/", async (req, res) => {
  const { email, name } = req.body;
  const user = await prisma.user.create({
    data: { email, name, password: '' },
  });
  res.status(201).json(user);
});

router.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "Invalid user id" });
    return;
  }
  const user = await prisma.user.update({
    where: { id },
    data: req.body,
  });
  res.json(user);
});

export default router;
