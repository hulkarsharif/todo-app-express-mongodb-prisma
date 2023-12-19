import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { prisma } from "./prisma/index.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/health", (_, res) => {
    res.status(200).json("Success");
});

app.post("/tasks", async (req, res) => {
    const {
        body: { text }
    } = req;
    if (!text || (text && text.length < 3)) {
        res.status(400).json({
            message: "Task is not valid!"
        });
    }

    try {
        const task = await prisma.task.create({
            data: { text }
        });

        res.status(201).json({
            data: task
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            select: {
                id: true,
                text: true,
                status: true
            }
        });

        res.status(200).json({
            data: tasks
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get("/tasks/:id", async (req, res) => {
    try {
        const { params } = req;
        const task = await prisma.task.findUnique({
            where: {
                id: params.id
            },
            select: {
                text: true,
                status: true
            }
        });
        res.status(201).json({
            data: task
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.patch("/tasks/:id", async (req, res) => {
    try {
        const { params, body } = req;
        await prisma.task.update({
            where: {
                id: params.id
            },
            data: {
                text: body.text,
                status: body.status
            }
        });
        res.status(200).json({
            data: "Success"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/tasks/:id", async (req, res) => {
    try {
        const { params } = req;
        await prisma.task.delete({
            where: {
                id: params.id
            }
        });
        res.status(200).json({
            data: "Success"
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
});
