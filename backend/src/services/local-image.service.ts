import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { ApiError } from "../utils/apiError";

const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

type SaveLocalImageInput = {
  imageData: string;
  mimeType: string;
  folder: "events" | "rewards" | "books";
  label: string;
  maxBytes?: number;
};

export async function saveLocalImage({
  imageData,
  mimeType,
  folder,
  label,
  maxBytes = 4 * 1024 * 1024
}: SaveLocalImageInput) {
  const extension = MIME_TO_EXTENSION[mimeType];
  if (!extension) {
    throw new ApiError(415, `Only JPG, PNG and WEBP ${label.toLowerCase()} files are allowed.`);
  }

  const base64 = imageData.includes(",") ? imageData.split(",", 2)[1] : imageData;
  if (!base64) throw new ApiError(400, `Invalid ${label.toLowerCase()}.`);

  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) throw new ApiError(400, `Invalid ${label.toLowerCase()}.`);
  if (buffer.length > maxBytes) {
    throw new ApiError(413, `${label} must be smaller than ${Math.floor(maxBytes / 1024 / 1024)} MB.`);
  }

  const directory = path.resolve(process.cwd(), "uploads", folder);
  await fs.mkdir(directory, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`;
  const filePath = path.join(directory, filename);
  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    publicUrl: `/uploads/${folder}/${filename}`
  };
}

export async function deleteLocalImage(publicUrl: string | null | undefined, folder: "events" | "rewards" | "books") {
  if (!publicUrl?.startsWith(`/uploads/${folder}/`)) return;
  const directory = path.resolve(process.cwd(), "uploads", folder);
  const filePath = path.join(directory, path.basename(publicUrl));
  await fs.unlink(filePath).catch(() => undefined);
}
