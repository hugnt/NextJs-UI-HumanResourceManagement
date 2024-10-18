import { newEmployee } from "@/data/schema/newEmployee.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const newEmployeeApiRequest = {
    getList: () => http.get<ApiResponse<newEmployee[]>>('/contracts'),
    getDetail: (id: number) => http.get<ApiResponse<newEmployee>>(`/contracts/${id}`),
    create: (body: newEmployee) => http.post<ApiResponse<boolean>>('/contracts', body),
    update: (id: number, body: newEmployee) => http.put<ApiResponse<boolean>>(`/contracts/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<newEmployee>>(`/contracts/${id}`)
}
export default newEmployeeApiRequest;