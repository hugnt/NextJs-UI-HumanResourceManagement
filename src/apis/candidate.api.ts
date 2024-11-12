import { Candidate } from "@/data/schema/candidate.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const applicantApiRequest = {
    getList: () => http.get<ApiResponse<Candidate[]>>('/applicants'),
    getById: (id: number) => http.get<ApiResponse<Candidate[]>>(`/applicants/${id}`),
    //getDetail: (id: number) => http.get<ApiResponse<Applicant>>(`/applicants/${id}`),
    create: (body: FormData) => http.post<ApiResponse<boolean>>('/applicants', body),
    update: (id: number, body: Candidate) => http.put<ApiResponse<boolean>>(`/applicants/update/${id}`, body),
    updatePoint: (id: number, point: number) => {
        console.log(http.put<ApiResponse<boolean>>(`/applicants/update-point/${id}`, point));
        return http.put<ApiResponse<boolean>>(`/applicants/update-point/${id}`, {point});
    },
    //updateTest: (id: number, body: Candidate) => http.put<ApiResponse<boolean>>(`/applicants/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Candidate>>(`/applicants/${id}`)
}
export default applicantApiRequest;