import { Advance } from "@/data/schema/advance.schema"; // Đảm bảo đường dẫn chính xác
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const advanceApiRequest = {
    getList: () => http.get<ApiResponse<Advance[]>>('/advances'),
    getDetail: (id: number) => http.get<ApiResponse<Advance>>(`/advances/${id}`),
    create: (body: Advance) => http.post<ApiResponse<boolean>>('/advances', body),
    update: (id: number, body: Advance) => http.put<ApiResponse<boolean>>(`/advances/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Advance>>(`/advances/${id}`)
};

export default advanceApiRequest;