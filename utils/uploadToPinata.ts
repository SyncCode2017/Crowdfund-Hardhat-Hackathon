import pinataSDK from "@pinata/sdk";
import fs from "fs";
import path from "path";

const pinataApiKey = process.env.PINATA_API_KEY || "";
const pinataApiSecret = process.env.PINATA_API_SECRET || "";
const pinata = pinataSDK(pinataApiKey, pinataApiSecret);

export async function storeImages(imagesFilePath: string) {
  const fullImagesPath = path.resolve(imagesFilePath);
  const files = fs.readdirSync(fullImagesPath);
  let responses: unknown[] = [];
  for (let fileIndex in files) {
    const readableStreamForFile = fs.createReadStream(
      `${fullImagesPath}/${files[fileIndex]}`
    );
    try {
      const response: unknown = await pinata.pinFileToIPFS(
        readableStreamForFile
      );
      responses.push(response);
    } catch (error) {
      console.log(error);
    }
  }
  return { responses, files };
}

export async function storeMetadataInPinata(
  metadata: string
): Promise<string | null> {
  try {
    const response: string = await pinata.pinJSONToIPFS(metadata);
    return response;
  } catch (error) {
    console.log(error);
  }
  return null;
}
