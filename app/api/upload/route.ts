import { type NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  const uploadDir = path.join(process.cwd(), "public/uploads");

  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = file.name;
    const filepath = path.join(uploadDir, filename);

    await fs.writeFile(filepath, buffer);

    const savedImage = await prisma.image.create({
      data: {
        filename: filename,
        filePath: `/uploads/${filename}`,
      },
    });

    return NextResponse.json({
      success: true,
      id: savedImage.id,
      filename: savedImage.filename,
      filepath: savedImage.filePath,
    });
  } catch (error) {
    console.error("Error handling file upload:", error);
    return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
  }
}