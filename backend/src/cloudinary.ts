import cloudinary, { UploadApiResponse } from 'cloudinary';
import { Readable } from 'node:stream';
import sharp from 'sharp';
import config from './config.js';

cloudinary.v2.config(
  {
    cloud_name: config.CLOUD_NAME,
    api_key: config.CLOUD_API_KEY,
    api_secret: config.CLOUD_API_SECRET,
  },
);

async function uploadImage(avatar): Promise<UploadApiResponse | undefined> {
  return new Promise((resolve, reject) => {
    if (!avatar) resolve(undefined);
    const { createReadStream } = avatar;
    const stream: Readable = createReadStream();

    const optimize = sharp().resize(256).webp({ lossless: true });
    const upload = cloudinary.v2.uploader.upload_stream(
      {
        folder: config.CLOUD_FOLDER,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.pipe(optimize).pipe(upload);
  });
}

async function destroyImage(public_id: string) {
  return cloudinary.v2.uploader.destroy(public_id);
}

export { uploadImage, destroyImage };
