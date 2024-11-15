import { Department, DepartmentUser, DepartmentUserCount } from "@/data/schema/department.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const departmentURL:string = "departments";
const departmentApiRequest = {
    getAllEmployeeInDepartment: (id: number) => http.get<ApiResponse<DepartmentUser[]>>(`/${departmentURL}/${id}/employee`),
    getEmployeeCountByDepartment: () =>
        http.get<ApiResponse<DepartmentUserCount[]>>(`/${departmentURL}/employee-count`),
    getList: () => http.get<ApiResponse<Department[]>>(`/${departmentURL}`),
    create: (body: Department) => http.post<ApiResponse<boolean>>(`/${departmentURL}`, body),
    update: (id: number, body: Department) => http.put<ApiResponse<boolean>>(`/${departmentURL}/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Department>>(`/${departmentURL}/${id}`)
}
export default departmentApiRequest;