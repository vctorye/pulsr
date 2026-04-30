import { Router } from "express";
import prisma from "../prisma";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany();
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
  const { googleId, email, name } = req.body;
  const user = await prisma.user.create({
    data: { googleId, email, name },
  });
  res.status(201).json(user);
});

export default router;
