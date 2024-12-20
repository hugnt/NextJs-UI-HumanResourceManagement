import { Contract } from "@/data/schema/contract.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const contractApiRequest = {
    getList: () => http.get<ApiResponse<Contract[]>>('/contracts'),
    getDetail: (id: number) => http.get<ApiResponse<Contract>>(`/contracts/${id}`),
    addnew: (id: number, body: Contract) => http.post<ApiResponse<boolean>>(`/contracts/applicants/${id}`, body ),  
    create: (body: Contract) => http.post<ApiResponse<boolean>>('/contracts', body),
    update: (id: number, body: Contract) => http.put<ApiResponse<boolean>>(`/contracts/update-contract/${id}`, body),
    updateStatus: (id: number, status: number) => http.put<ApiResponse<boolean>>(`/contracts/update-status/${id}/${status}`,null),
    delete: (id: number) => http.delete<ApiResponse<Contract>>(`/contracts/${id}`),
    signContract: (contractId: number, body: FormData) => http.post<ApiResponse<boolean>>(`/contracts/add-employee-signature/${contractId}`,body),
    generateContractPDF: (contractId: number) => http.post<ApiResponse<boolean>>(`/contracts/create-contract-pdf/${contractId}`,null)
}
export default contractApiRequest;

