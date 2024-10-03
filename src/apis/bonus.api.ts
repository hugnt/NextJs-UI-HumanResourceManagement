import { Bonus } from "@/data/schema/bonus.schema"; // Đảm bảo đường dẫn chính xác
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const bonusApiRequest = {
    getList: () => http.get<ApiResponse<Bonus[]>>('/bonuses'),
    getDetail: (id: number) => http.get<ApiResponse<Bonus>>(`/bonuses/${id}`),
    create: (body: Bonus) => http.post<ApiResponse<boolean>>('/bonuses', body),
    update: (id: number, body: Bonus) => http.put<ApiResponse<boolean>>(`/bonuses/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Bonus>>(`/bonuses/${id}`)
};

export default bonusApiRequest;