import { AccountInfo, AccountUpdate, Auth } from "@/data/schema/auth.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const authURL: string = "auth";
const authApiRequest = {
    adminLogin: (body: Auth) => http.post<ApiResponse<string>>(`/${authURL}/admin-login`, body),
    employeeLogin: (body: Auth) => http.post<ApiResponse<string>>(`/${authURL}/employee-login`, body),
    logout: () => http.delete<ApiResponse<boolean>>(`/${authURL}/log-out`),
    getCurrentUser: () => http.get<ApiResponse<AccountInfo>>(`/${authURL}/get-current-user`),
    updateAccount:(id: number, accountUpdate: AccountUpdate) => http.put<ApiResponse<boolean>>(`/${authURL}/update-account/${id}`, accountUpdate)
}
export default authApiRequest;