import type { StudentPhotoCrop } from "./types";

export const MAX_STUDENT_PHOTO_BYTES = 10 * 1024 * 1024;
export const STUDENT_PHOTO_SIZE = 256;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The photo could not be opened."));
    image.src = src;
  });

export const loadStudentPhoto = async (file: File): Promise<string> => {
  if (
    !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
    file.size > MAX_STUDENT_PHOTO_BYTES ||
    file.size === 0
  ) {
    throw new Error("Choose a JPEG, PNG or WebP photo smaller than 10 MB.");
  }

  const src = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("The photo could not be opened."));
    reader.onabort = () => reject(new Error("The photo could not be opened."));
    reader.readAsDataURL(file);
  });
  const image = await loadImage(src);
  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error("The photo could not be opened.");
  }
  return src;
};

export const cropStudentPhoto = async (
  src: string,
  crop: StudentPhotoCrop,
): Promise<string> => {
  const image = await loadImage(src);
  const zoom = Math.min(3, Math.max(1, crop.zoom));
  const offsetX = Math.min(1, Math.max(-1, crop.offsetX));
  const offsetY = Math.min(1, Math.max(-1, crop.offsetY));
  if (![zoom, offsetX, offsetY].every(Number.isFinite)) {
    throw new Error("The photo crop is invalid.");
  }

  const side = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
  const x = ((image.naturalWidth - side) * (offsetX + 1)) / 2;
  const y = ((image.naturalHeight - side) * (offsetY + 1)) / 2;
  const canvas = document.createElement("canvas");
  canvas.width = STUDENT_PHOTO_SIZE;
  canvas.height = STUDENT_PHOTO_SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("The photo could not be prepared.");

  // Flatten transparency before JPEG encoding; the saved crop contains no EXIF.
  context.fillStyle = "#fff8e9";
  context.fillRect(0, 0, STUDENT_PHOTO_SIZE, STUDENT_PHOTO_SIZE);
  context.drawImage(
    image,
    x,
    y,
    side,
    side,
    0,
    0,
    STUDENT_PHOTO_SIZE,
    STUDENT_PHOTO_SIZE,
  );
  return canvas.toDataURL("image/jpeg", 0.88);
};
