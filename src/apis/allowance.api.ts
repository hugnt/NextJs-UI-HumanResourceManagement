import { Allowance } from "@/data/schema/allowance.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const allowanceApiRequest = {
    getList: () => http.get<ApiResponse<Allowance[]>>('/allowances'),
    getDetail: (id: number) => http.get<ApiResponse<Allowance>>(`/allowances/${id}`),
    create: (body: Allowance) => http.post<ApiResponse<boolean>>('/allowances', body),
    update: (id: number, body: Allowance) => http.put<ApiResponse<boolean>>(`/allowances/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Allowance>>(`/allowances/${id}`)
}
export default allowanceApiRequest;