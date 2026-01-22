import ImageKit from "imagekit"
import { ErrorHandlerClass } from "./error-class.utils.js";


export const imageKitConfig = () => {
  const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
  });

  return imagekit;
}

export const uploadFile = async ({ file, folder = process.env.GENERAL_FOLDER, fileName }) => {

  if (!file) {
    return next(new ErrorHandlerClass("File is required", 400, "imagekit utils"));
  }

  let options = { folder };

  if (file) {
    options.file = file;
  }

  if (fileName) {
    options.fileName = fileName;
  }

  const {url, filePath, fileId} = await imageKitConfig().upload({...options});

  return { url, filePath, fileId };
}