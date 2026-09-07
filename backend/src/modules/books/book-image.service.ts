import {
  deleteLocalImage,
  saveLocalImage,
} from "../../services/local-image.service";

export async function saveBookImage(
  imageData: string,
  mimeType: string
) {
  const saved = await saveLocalImage({
    imageData,
    mimeType,
    folder: "books",
    label: "Book cover",
    maxBytes: 4 * 1024 * 1024,
  });

  return {
    coverUrl: saved.publicUrl,
    filePath: saved.filePath,
  };
}

export async function deleteBookImage(
  coverUrl?: string | null
) {
  await deleteLocalImage(
    coverUrl,
    "books"
  );
}