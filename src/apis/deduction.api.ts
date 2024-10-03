import { Deduction } from "@/data/schema/deduction.schema"; // Đảm bảo đường dẫn chính xác
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const deductionApiRequest = {
    getList: () => http.get<ApiResponse<Deduction[]>>('/deductions'),
    getDetail: (id: number) => http.get<ApiResponse<Deduction>>(`/deductions/${id}`),
    create: (body: Deduction) => http.post<ApiResponse<boolean>>('/deductions', body),
    update: (id: number, body: Deduction) => http.put<ApiResponse<boolean>>(`/deductions/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Deduction>>(`/deductions/${id}`)
};

export default deductionApiRequest;