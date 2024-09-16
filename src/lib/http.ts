/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import envConfig from "@/config";
import { assertApiResponse, handleErrorApi } from "@/lib/utils";

type CustomOptions = RequestInit & {
  baseUrl?: string | undefined;
};

class SessionToken {
  private token = "";
  get value() {
    return this.token;
  }
  set value(token: string) {
    //Gọi method này ở server thì bị lỗi -> chỉ dùng cho client
    if (typeof window === "undefined") {
      throw new Error("Cannot set token on server side");
    }
    this.token = this.token;
  }
}

export const sessionToken = new SessionToken();

export const isClient = () => typeof window !== "undefined";
const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: { [key: string]: string } =
    body instanceof FormData ? {} : { "Content-Type": "application/json" };
  if (isClient()) {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      baseHeaders.Authorization = `Bearer ${sessionToken}`;
    }
  }
  // Nếu không truyền baseUrl (hoặc baseUrl = undefined) thì lấy từ envConfig.NEXT_PUBLIC_API_ENDPOINT
  // Nếu truyền baseUrl thì lấy giá trị truyền vào, truyền vào '' thì đồng nghĩa với việc chúng ta gọi API đến Next.js Server
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

  const fullUrl = url.startsWith("/")
    ? `${baseUrl}${url}`
    : `${baseUrl}/${url}`;

  const res = await fetch(fullUrl, {
    ...options,
    headers: {
      ...baseHeaders,
      ...options?.headers,
    } as any,
    body,
    method,
  });

  const payload: Response = await res.json();
  const data = {
    status: res.status,
    payload,
  };
  try {
    const resData = assertApiResponse<T>(payload);
    // console.log("resData",resData)
    return resData;
  } catch (error) {
    console.error(error)
    throw error;
  }
  
  
};

const http = {
  get<T>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<T>("GET", url, options);
  },
  post<T>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<T>("POST", url, { ...options, body });
  },
  put<T>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<T>("PUT", url, { ...options, body });
  },
  delete<T>(url: string, options?: Omit<CustomOptions, "body"> | undefined) {
    return request<T>("DELETE", url, { ...options });
  },
};

export default http;
