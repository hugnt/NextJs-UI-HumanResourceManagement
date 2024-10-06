import { Insurance } from "@/data/schema/insurance.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const insuranceApiRequest = {
    getList: () => http.get<ApiResponse<Insurance[]>>('/insurances'),
    getDetail: (id: number) => http.get<ApiResponse<Insurance>>(`/insurances/${id}`),
    create: (body: Insurance) => http.post<ApiResponse<boolean>>('/insurances', body),
    update: (id: number, body: Insurance) => http.put<ApiResponse<boolean>>(`/insurances/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Insurance>>(`/insurances/${id}`)
}
export default insuranceApiRequest;