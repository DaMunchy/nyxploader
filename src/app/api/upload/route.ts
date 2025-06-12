import { writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file: File | null = data.get("file") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = file.name.replace(/\s/g, "_");
    const filePath = path.join(process.cwd(), "public", filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `https://nyxploader.vercel.app/${filename}`,
    });
  } catch (error) {
    console.error("Upload failed in API:", error); // 👈 BIAR KEPRINT KALAU ERROR
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
