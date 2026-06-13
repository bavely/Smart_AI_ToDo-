import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/lib/tasks.types";
import { NextRequest, NextResponse } from "next/server";

type StoredTask = {
  id: number;
  title: string;
  status: string;
};

const validStatuses = new Set<string>(Object.values(TaskStatus));

function toApiTask(task: StoredTask) {
  return {
    _id: task.id,
    title: task.title,
    status: task.status as TaskStatus,
  };
}

function parseTaskId(id: unknown) {
  const taskId = typeof id === "number" ? id : Number(id);
  return Number.isInteger(taskId) && taskId > 0 ? taskId : null;
}

function parseStatus(status: unknown) {
  return typeof status === "string" && validStatuses.has(status)
    ? (status as TaskStatus)
    : null;
}

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { id: "asc" },
    });

    return NextResponse.json({ success: true, data: tasks.map(toApiTask) });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, status } = await request.json();

    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: "Task title is required" }, { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        status: parseStatus(status) ?? TaskStatus.todo,
      },
    });

    return NextResponse.json({ success: true, data: toApiTask(task) }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();
    const taskId = parseTaskId(id);
    const taskStatus = parseStatus(status);

    if (!taskId || !taskStatus) {
      return NextResponse.json({ success: false, error: "Valid task id and status are required" }, { status: 400 });
    }

    const result = await prisma.task.updateMany({
      where: { id: taskId },
      data: { status: taskStatus },
    });

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const taskId = parseTaskId(id);

    if (!taskId) {
      return NextResponse.json({ success: false, error: "Valid task id is required" }, { status: 400 });
    }

    const result = await prisma.task.deleteMany({
      where: { id: taskId },
    });

    if (result.count === 0) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to delete item" }, { status: 500 });
  }
}
