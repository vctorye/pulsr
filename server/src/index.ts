import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRouter from "./routes/users";
import authRouter from "./routes/auth"
import foodRouter from "./routes/foods"
import mealsRouter from "./routes/meals"
import cardioRouter from "./routes/cardio"
import workoutsRouter from "./routes/workouts"
import friendsRouter from "./routes/friends"
import postsRouter from "./routes/posts"
import likesRouter from "./routes/likes"
import commentsRouter from "./routes/comments"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/users", usersRouter);

app.use("/auth", authRouter)

app.use("/foods", foodRouter)

app.use("/meals", mealsRouter)

app.use("/workouts", workoutsRouter)

app.use("/cardio", cardioRouter)

app.use("/friends", friendsRouter)

app.use("/posts", postsRouter)

app.use("/likes", likesRouter)

app.use("/comments", commentsRouter)


app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
