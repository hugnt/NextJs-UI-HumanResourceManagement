import { ContractSalary } from "@/data/schema/contractSalary.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const contractSalaryApiRequest = {
    getList: () => http.get<ApiResponse<ContractSalary[]>>('/contractSalarys'),
    getDetail: (id: number) => http.get<ApiResponse<ContractSalary>>(`/contractSalarys/${id}`),
    create: (body: ContractSalary) => http.post<ApiResponse<boolean>>('/contractSalarys', body),
    update: (id: number, body: ContractSalary) => http.put<ApiResponse<boolean>>(`/contractSalarys/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<ContractSalary>>(`/contractSalarys/${id}`)
}
export default contractSalaryApiRequest;