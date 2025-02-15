import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {
  try {
    const images = await prisma.image.findMany();

    return NextResponse.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json({ error: "Error fetching images" }, { status: 500 });
  }
}