import { EmployeeData, leaveApplication } from "@/data/schema/leaveApplication.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const leaveApplicationApiRequest = {
    getAllEmployee: () => http.get<ApiResponse<EmployeeData[]>>(`/leave-applications/employee`),
    getList: () => http.get<ApiResponse<leaveApplication[]>>('/leave-applications'),
    getDetail: (id: number) => http.get<ApiResponse<leaveApplication>>(`/leave-applications/${id}`),
    create: (body: leaveApplication) => http.post<ApiResponse<boolean>>('/leave-applications', body),
    update: (id: number, body: leaveApplication) => http.put<ApiResponse<boolean>>(`/leave-applications/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<boolean>>(`/leave-applications/${id}`)
};

export default leaveApplicationApiRequest;