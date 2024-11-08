import { TestResult } from "@/data/schema/testResult.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const testResultApiRequest = {
    getList: () => http.get<ApiResponse<TestResult[]>>('/testResults'),
    getListById: (testId: number) => http.get<ApiResponse<TestResult[]>>(`/testResults/${testId}`),
    //getDetail: (id: number) => http.get<ApiResponse<Applicant>>(`/testResults/${id}`),
    create: (body: TestResult) => http.post<ApiResponse<boolean>>('/testResults', body),
    createList: (body: TestResult[]) => http.post<ApiResponse<boolean>>('/testResults/list', body),
    update: (id: number, body: TestResult) => http.put<ApiResponse<boolean>>(`/testResults/${id}`, body),
    //updateTest: (id: number, body: TestResult) => http.put<ApiResponse<boolean>>(`/testResults/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<TestResult>>(`/testResults/${id}`)
}
export default testResultApiRequest;