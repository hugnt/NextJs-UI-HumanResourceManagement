import { ContractType } from "@/data/schema/contractType.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const contractTypeApiRequest = {
    getList: () => http.get<ApiResponse<ContractType[]>>('/contracttypes'),
    getDetail: (id: number) => http.get<ApiResponse<ContractType>>(`/contracttypes/${id}`),
    create: (body: ContractType) => http.post<ApiResponse<boolean>>('/contracttypes', body),
    update: (id: number, body: ContractType) => http.put<ApiResponse<boolean>>(`/contracttypes/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<ContractType>>(`/contracttypes/${id}`)
}
export default contractTypeApiRequest;