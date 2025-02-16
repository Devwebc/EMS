import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function uploadFile(file: File, folder: string): Promise<string> {
  const uploadDir = path.join(process.cwd(), "public/uploads", folder);
  
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filename = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadDir, filename);
  const buffer = await file.arrayBuffer();

  await writeFile(filePath, Buffer.from(buffer));

  return `/uploads/${folder}${filename}`; // Return relative URL for serving
}
