import { callAPIWithToken } from "@/server/helper";
import { BASEURL } from "@/server/main";

export const getImageUrl = async (data: { file: File }) => {
  const formData = new FormData();
  formData.append("file", data.file);

  try {
    const response = await callAPIWithToken<any>(
      `https://gcp-api.edify.club/edifybackend/v1/file/upload`,
      "POST",
      formData,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};
