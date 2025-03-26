export function buildCloudinaryUrl(img_version: number, img_type: string, img_id: number) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    return `https://res.cloudinary.com/${cloudName}/image/upload/v${img_version}/woozy/${img_type}/${img_id}.png`
}