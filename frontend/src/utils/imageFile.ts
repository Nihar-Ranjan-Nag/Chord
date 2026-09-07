export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const MAX_IMAGE_SIZE = 4 * 1024 * 1024

export function validateImageFile(file: File, label = 'Image') {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return `${label} must be a JPG, PNG or WEBP file.`
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return `${label} must be smaller than 4 MB.`
  }
  return ''
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(new Error('Unable to read the selected image.'))
    reader.readAsDataURL(file)
  })
}
