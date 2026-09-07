import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { ApiError } from "../../utils/apiError";

const PROFILE_DIRECTORY = path.resolve(process.cwd(), "uploads", "profiles");
const MAX_FILE_SIZE = 2 * 1024 * 1024;
const MIME_TO_EXTENSION: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp"
};

type SaveAvatarInput = {
  imageData: string;
  mimeType: string;
};

export async function saveProfileAvatar({ imageData, mimeType }: SaveAvatarInput) {
  const extension = MIME_TO_EXTENSION[mimeType];
  if (!extension) {
    throw new ApiError(415, "Only JPG, PNG and WEBP images are allowed.");
  }

  const base64 = imageData.includes(",") ? imageData.split(",", 2)[1] : imageData;
  if (!base64) throw new ApiError(400, "Invalid profile image.");

  let buffer: Buffer;
  try {
    buffer = Buffer.from(base64, "base64");
  } catch {
    throw new ApiError(400, "Invalid profile image.");
  }

  if (!buffer.length) throw new ApiError(400, "Invalid profile image.");
  if (buffer.length > MAX_FILE_SIZE) {
    throw new ApiError(413, "Profile image must be smaller than 2 MB.");
  }

  await fs.mkdir(PROFILE_DIRECTORY, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(12).toString("hex")}${extension}`;
  const filePath = path.join(PROFILE_DIRECTORY, filename);
  await fs.writeFile(filePath, buffer);

  return {
    filePath,
    avatarUrl: `/uploads/profiles/${filename}`
  };
}

export async function deleteLocalProfileAvatar(avatarUrl?: string | null) {
  if (!avatarUrl?.startsWith("/uploads/profiles/")) return;

  const filePath = path.join(PROFILE_DIRECTORY, path.basename(avatarUrl));
  await fs.unlink(filePath).catch(() => undefined);
}
