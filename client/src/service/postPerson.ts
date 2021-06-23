import axios, { AxiosResponse } from "axios";

export type Nullable<T> = T | null;

const postPerson = async (
  name: Nullable<string>,
  birth: Nullable<string>
): Promise<string> => {
  try {
    const body = new URLSearchParams();
    body.append("name", name || "");
    body.append("date", birth || "");
    const response: AxiosResponse<string> = await axios.post(
      `http://localhost:4000/`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    return response.data;
  } catch (error) {
    return "";
  }
};

export default postPerson;
