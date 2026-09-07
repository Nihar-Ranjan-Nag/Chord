import fs from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import { ApiError } from "../utils/apiError";
import { env } from "../config/env";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

type ImageFolder =
  | "events"
  | "rewards"
  | "books";

type SaveLocalImageInput = {
  imageData: string;
  mimeType: string;
  folder: ImageFolder;
  label: string;
  maxBytes?: number;
};

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

function getCloudinaryPublicId(publicUrl: string) {
  try {
    const url = new URL(publicUrl);

    if (!url.hostname.endsWith("cloudinary.com")) {
      return null;
    }

    const parts = url.pathname
      .split("/")
      .filter(Boolean);

    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex === -1) {
      return null;
    }

    let publicIdParts = parts.slice(uploadIndex + 1);

    if (
      publicIdParts[0] &&
      /^v\d+$/.test(publicIdParts[0])
    ) {
      publicIdParts = publicIdParts.slice(1);
    }

    if (!publicIdParts.length) {
      return null;
    }

    const lastIndex =
      publicIdParts.length - 1;

    publicIdParts[lastIndex] =
      publicIdParts[lastIndex].replace(
        /\.[a-zA-Z0-9]+$/,
        ""
      );

    return decodeURIComponent(
      publicIdParts.join("/")
    );
  } catch {
    return null;
  }
}

export async function saveLocalImage({
  imageData,
  mimeType,
  folder,
  label,
  maxBytes = 4 * 1024 * 1024,
}: SaveLocalImageInput) {
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    throw new ApiError(
      415,
      `Only JPG, PNG and WEBP ${label.toLowerCase()} files are allowed.`
    );
  }

  const base64 = imageData.includes(",")
    ? imageData.split(",", 2)[1]
    : imageData;

  if (!base64) {
    throw new ApiError(
      400,
      `Invalid ${label.toLowerCase()}.`
    );
  }

  const buffer = Buffer.from(
    base64,
    "base64"
  );

  if (!buffer.length) {
    throw new ApiError(
      400,
      `Invalid ${label.toLowerCase()}.`
    );
  }

  if (buffer.length > maxBytes) {
    throw new ApiError(
      413,
      `${label} must be smaller than ${Math.floor(
        maxBytes / 1024 / 1024
      )} MB.`
    );
  }

  const dataUri =
    `data:${mimeType};base64,${base64}`;

  try {
    const result =
      await cloudinary.uploader.upload(
        dataUri,
        {
          folder: `chord/${folder}`,
          resource_type: "image",
          use_filename: false,
          unique_filename: true,
          overwrite: false,
        }
      );

    return {
      filePath: result.public_id,
      publicUrl: result.secure_url,
    };
  } catch (error) {
    console.error(
      `Cloudinary ${label} upload failed:`,
      error
    );

    throw new ApiError(
      500,
      `Unable to upload ${label.toLowerCase()}.`
    );
  }
}

export async function deleteLocalImage(
  publicUrl: string | null | undefined,
  folder: ImageFolder
) {
  if (!publicUrl) {
    return;
  }

  // New Cloudinary images
  if (/^https?:\/\//i.test(publicUrl)) {
    const publicId =
      getCloudinaryPublicId(publicUrl);

    if (!publicId) {
      return;
    }

    if (
      !publicId.startsWith(
        `chord/${folder}/`
      )
    ) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image",
          invalidate: true,
        }
      );
    } catch (error) {
      console.error(
        "Cloudinary image delete failed:",
        error
      );
    }

    return;
  }

  // Old local images - retained for compatibility
  if (
    !publicUrl.startsWith(
      `/uploads/${folder}/`
    )
  ) {
    return;
  }

  const directory = path.resolve(
    process.cwd(),
    "uploads",
    folder
  );

  const filePath = path.join(
    directory,
    path.basename(publicUrl)
  );

  await fs
    .unlink(filePath)
    .catch(() => undefined);
}