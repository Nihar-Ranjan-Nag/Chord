import { deleteLocalImage, saveLocalImage } from "../../services/local-image.service";

export async function saveRewardImage(imageData: string, mimeType: string) {
  const saved = await saveLocalImage({
    imageData,
    mimeType,
    folder: "rewards",
    label: "Reward image",
    maxBytes: 4 * 1024 * 1024
  });

  return { imageUrl: saved.publicUrl, filePath: saved.filePath };
}

export async function deleteRewardImage(imageUrl?: string | null) {
  await deleteLocalImage(imageUrl, "rewards");
}
