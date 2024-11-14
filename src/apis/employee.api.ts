import { Employee, ProfileDetail } from "@/data/schema/employee.schema"; // Đảm bảo đường dẫn chính xác
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const employeeApiRequest = {
    getList: () => http.get<ApiResponse<Employee[]>>('/employees'),
    getDetail: (id: number) => http.get<ApiResponse<Employee>>(`/employees/${id}`),
    create: (body: Employee) => http.post<ApiResponse<boolean>>('/employees', body),
    update: (id: number, body: Employee) => http.put<ApiResponse<boolean>>(`/employees/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Employee>>(`/employees/${id}`),
    getCurrentUserProfile: () => http.get<ApiResponse<ProfileDetail>>('/employees/current-profile')
};

export default employeeApiRequest;