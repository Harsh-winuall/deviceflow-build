import { callAPIWithToken } from "./helper";
import { BASEURL } from "./main";

export async function globalSearch(searchQuery: string) {
  try {
    const apiUrl = `${BASEURL}/edifybackend/v1/globalSearch/`;
    const body = { searchQuery };
    const response = await callAPIWithToken<Record<string, any[]>>(
      apiUrl,
      "POST",
      body
    );

    return response.data;
  } catch (err: any) {
    throw new Error(err?.response ?? "Failed to search.");
  }
}
