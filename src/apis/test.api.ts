import { Test } from "@/data/schema/test.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const testApiRequest = {
    getList: () => http.get<ApiResponse<Test[]>>('/tests'),
    // getDetail: (id: number) => http.get<ApiResponse<Test>>(`/tests/${id}`),
    create: (body: Test) => http.post<ApiResponse<boolean>>('/tests', body),
    update: (id: number, body: Test) => http.put<ApiResponse<boolean>>(`/tests/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Test>>(`/tests/${id}`)
}
export default testApiRequest;