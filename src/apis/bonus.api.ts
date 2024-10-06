import { Bonus } from "@/data/schema/bonus.schema"; // Đảm bảo đường dẫn chính xác
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const bonusApiRequest = {
    getList: () => http.get<ApiResponse<Bonus[]>>('/bonus'),
    getDetail: (id: number) => http.get<ApiResponse<Bonus>>(`/bonus/${id}`),
    create: (body: Bonus) => http.post<ApiResponse<boolean>>('/bonus', body),
    update: (id: number, body: Bonus) => http.put<ApiResponse<boolean>>(`/bonus/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Bonus>>(`/bonus/${id}`)
};

export default bonusApiRequest;