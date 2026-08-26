import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

const ALLOWED_FOLDERS = ["shaishaarts/hero", "shaishaarts/products"];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const requestedFolder = formData.get("folder") as string | null;
    const folder = ALLOWED_FOLDERS.includes(requestedFolder || "") ? requestedFolder! : "shaishaarts";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Image size must be less than 5MB" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const url = await uploadImage(buffer, folder);

    return NextResponse.json({ url });
  } catch (error) {
    console.error("POST Admin Upload Image Error:", error);
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
  }
}
