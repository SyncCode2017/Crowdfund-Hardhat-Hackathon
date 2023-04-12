import { imagesLocation } from "../utils/constants";
import { storeNFTs } from "../utils/uploadToNftStorage";

async function main(): Promise<void> {
  await handleTokenUris();
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

async function handleTokenUris() {
  const { responses: imageUploadResponses, files } = await storeNFTs(
    imagesLocation
  );
  console.log(imageUploadResponses);
}
