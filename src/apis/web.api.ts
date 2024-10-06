import { Web } from "@/data/schema/web.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const webApiRequest = {
    getList: () => http.get<ApiResponse<Web[]>>('/webs'),
    //getDetail: (id: number) => http.get<ApiResponse<Web>>(`/webs/${id}`),
    create: (body: Web) => http.post<ApiResponse<boolean>>('/webs', body),
    update: (id: number, body: Web) => http.put<ApiResponse<boolean>>(`/webs/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Web>>(`/webs/${id}`)
}
export default webApiRequest;