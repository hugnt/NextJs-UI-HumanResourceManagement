import { Question } from "@/data/schema/question.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const questionApiRequest = {
    getList: () => http.get<ApiResponse<Question[]>>('/questions'),
    getListById: (testId: number) => http.get<ApiResponse<Question[]>>(`/questions/${testId}`),
    // getDetail: (id: number) => http.get<ApiResponse<Question>>(`/questions/${id}`),
    create: (body: Question) => http.post<ApiResponse<boolean>>('/questions', body),
    update: (id: number, body: Question) => http.put<ApiResponse<boolean>>(`/questions/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Question>>(`/questions/${id}`)
}
export default questionApiRequest;