import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import path from "path"
import fs from "fs"

const prisma = new PrismaClient()

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  try {
    const image = await prisma.image.findUnique({ where: { id } })

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 })
    }

    const filePath = path.join(process.cwd(), "public", image.filePath)
    const fileBuffer = fs.readFileSync(filePath)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image",
        "Content-Disposition": `inline; filename="${image.filename}"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 })
  }
}