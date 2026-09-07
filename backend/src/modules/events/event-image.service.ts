import { deleteLocalImage, saveLocalImage } from "../../services/local-image.service";

type SaveEventImageInput = {
  imageData: string;
  mimeType: string;
};

export async function saveEventImage(input: SaveEventImageInput) {
  const saved = await saveLocalImage({
    ...input,
    folder: "events",
    label: "Event image",
    maxBytes: 4 * 1024 * 1024
  });

  return {
    filePath: saved.filePath,
    bannerUrl: saved.publicUrl
  };
}

export async function deleteLocalEventImage(bannerUrl?: string | null) {
  await deleteLocalImage(bannerUrl, "events");
}
