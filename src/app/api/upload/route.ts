import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const blob = await put(file.name, file.stream(), {
    access: "public",
  });

  // blob.url will be like: https://...vercel-storage.com/file.jpg
  // But with vercel.json rewrite, we can return custom domain
  const fileName = encodeURIComponent(file.name.replace(/\s+/g, "_"));

  return NextResponse.json({
    url: `https://nyxploader.vercel.app/${fileName}`
  });
}
