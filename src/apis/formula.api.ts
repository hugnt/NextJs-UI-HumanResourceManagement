import { Formula } from "@/data/schema/formula.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const formulaApiRequest = {
    getList: () => http.get<ApiResponse<Formula[]>>('/fomulas'),
    getDetail: (id: number) => http.get<ApiResponse<Formula>>(`/fomulas/${id}`),
    create: (body: Formula) => http.post<ApiResponse<boolean>>('/fomulas', body),
    update: (id: number, body: Formula) => http.put<ApiResponse<boolean>>(`/fomulas/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Formula>>(`/fomulas/${id}`)
}
export default formulaApiRequest;