import {
  deleteLocalImage,
  saveLocalImage,
} from "../../services/local-image.service";

type SaveAvatarInput = {
  imageData: string;
  mimeType: string;
};

/* ============================================================
   SAVE PROFILE AVATAR
============================================================ */

export async function saveProfileAvatar({
  imageData,
  mimeType,
}: SaveAvatarInput) {
  const saved =
    await saveLocalImage({
      imageData,
      mimeType,

      folder:
        "profiles",

      label:
        "Profile image",

      maxBytes:
        2 * 1024 * 1024,
    });

  return {
    avatarUrl:
      saved.publicUrl,

    filePath:
      saved.filePath,
  };
}

/* ============================================================
   DELETE PROFILE AVATAR
============================================================ */

export async function deleteLocalProfileAvatar(
  avatarUrl?:
    | string
    | null
) {
  await deleteLocalImage(
    avatarUrl,
    "profiles"
  );
}