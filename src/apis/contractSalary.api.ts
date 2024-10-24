import { ContractSalary } from "@/data/schema/contractSalary.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const contractSalaryApiRequest = {
    getList: () => http.get<ApiResponse<ContractSalary[]>>('/contractsalarys'),
    getDetail: (id: number) => http.get<ApiResponse<ContractSalary>>(`/contractsalarys/${id}`),
    create: (body: ContractSalary) => http.post<ApiResponse<boolean>>('/contractsalarys', body),
    update: (id: number, body: ContractSalary) => http.put<ApiResponse<boolean>>(`/contractsalarys/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<ContractSalary>>(`/contractsalarys/${id}`)
}
export default contractSalaryApiRequest;