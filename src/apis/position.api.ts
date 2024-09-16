import { Position } from "@/data/schema/position.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const positionApiRequest = {
    getList: () => http.get<ApiResponse<Position[]>>('/positions'),
    getDetail: (id: number) =>
      http.get<ApiResponse<Position>>(`/positions/${id}`, {
        cache: 'no-store'
    }),
    create: (body: Position) => http.post<ApiResponse<boolean>>('/positions', body),
    update: (id: number, body: Position) => http.put<ApiResponse<boolean>>(`/positions/${id}`, body),
    uploadImage: (body: FormData) => http.post<ApiResponse<boolean>>('/media/upload', body),
    delete: (id: number) => http.delete<ApiResponse<Position>>(`/positions/${id}`)
}
export default positionApiRequest;