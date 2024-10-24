import { JobPosting } from "@/data/schema/jobPosting,schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const jobPostingApiRequest = {
    getList: () => http.get<ApiResponse<JobPosting[]>>('/jobPostings'),
    // getDetail: (id: number) => http.get<ApiResponse<JobPosting>>(`/jobPostings/${id}`),
    create: (body: JobPosting) => http.post<ApiResponse<boolean>>('/jobPostings', body),
    update: (id: number, body: JobPosting) => http.put<ApiResponse<boolean>>(`/jobPostings/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<JobPosting>>(`/jobPostings/${id}`)
}
export default jobPostingApiRequest;