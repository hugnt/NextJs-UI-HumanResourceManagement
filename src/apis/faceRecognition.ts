import { Employee, FaceRegisResult } from "@/data/schema/employee.schema"; 
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const employeeURL:string = "employees";
const employeeApiRequest = {
    getAllFaceRegisByEmployeeId:(id: number) => http.get<ApiResponse<FaceRegisResult[]>>(`/${employeeURL}/${id}/employee-images`),
    registrationFace: (id: number, data: FormData) => http.post<ApiResponse<Employee[]>>(`/${employeeURL}/regis-face/${id}`, data),
};

export default employeeApiRequest;