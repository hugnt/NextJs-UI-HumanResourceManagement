import { Contract } from "@/data/schema/contract.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const contractApiRequest = {
    getList: () => http.get<ApiResponse<Contract[]>>('/contracts'),
    getDetail: (id: number) => http.get<ApiResponse<Contract>>(`/contracts/${id}`),
    create: (body: Contract) => http.post<ApiResponse<boolean>>('/contracts', body),
    update: (id: number, body: Contract) => http.put<ApiResponse<boolean>>(`/contracts/update-contract/${id}`, body),
    updateStatus: (id: number, status: number) => http.put<ApiResponse<boolean>>(`/contracts/update-status/${id}/${status}`,null),
    delete: (id: number) => http.delete<ApiResponse<Contract>>(`/contracts/${id}`)
}
export default contractApiRequest;

