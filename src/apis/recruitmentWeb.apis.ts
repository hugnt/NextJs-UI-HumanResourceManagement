import { RecruitmentWeb } from "@/data/schema/recruitmentWeb.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const recruitmentWebApiRequest = {
    getList: () => http.get<ApiResponse<RecruitmentWeb[]>>('/recruitmentWebs'),
    // getDetail: (id: number) => http.get<ApiResponse<RecruitmentWeb>>(`/recruitmentWebs/${id}`),
    create: (body: RecruitmentWeb) => http.post<ApiResponse<boolean>>('/recruitmentWebs', body),
    update: (id: number, body: RecruitmentWeb) => http.put<ApiResponse<boolean>>(`/recruitmentWebs/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<RecruitmentWeb>>(`/recruitmentWebs/${id}`)
}
export default recruitmentWebApiRequest;