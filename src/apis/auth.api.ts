import { Auth } from "@/data/schema/auth.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const authURL: string = "auth";
const authApiRequest = {
    login: (body: Auth) => http.post<ApiResponse<string>>(`/${authURL}/login`, body),
    logout: () => http.delete<ApiResponse<boolean>>(`/${authURL}/log-out`)
}
export default authApiRequest;