import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "Dosya gerekli" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  return new Promise((resolve) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "ulku-yaman/products",
        transformation: [
          { width: 1200, height: 1600, crop: "limit", quality: "auto", format: "webp" },
        ],
      },
      (error, result) => {
        if (error) {
          resolve(NextResponse.json({ error: "Yükleme hatası" }, { status: 500 }));
        } else {
          resolve(NextResponse.json({
            url: result?.secure_url,
            publicId: result?.public_id,
            width: result?.width,
            height: result?.height,
          }));
        }
      }
    ).end(buffer);
  });
}
