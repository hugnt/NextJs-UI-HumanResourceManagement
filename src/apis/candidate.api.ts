import { Candidate } from "@/data/schema/candidate.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const applicantApiRequest = {
    getList: () => http.get<ApiResponse<Candidate[]>>('/applicants'),
    //getDetail: (id: number) => http.get<ApiResponse<Applicant>>(`/applicants/${id}`),
    create: (body: Candidate) => http.post<ApiResponse<boolean>>('/applicants', body),
    update: (id: number, body: Candidate) => http.put<ApiResponse<boolean>>(`/applicants/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Candidate>>(`/applicants/${id}`)
}
export default applicantApiRequest;