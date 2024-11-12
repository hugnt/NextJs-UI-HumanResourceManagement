import { FaceRegisResult } from "@/data/schema/employee.schema"; 
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const employeeURL:string = "employees";
const faceRegisApiRequest = {
    getAllFaceRegisByEmployeeId:(id: number) => http.get<ApiResponse<FaceRegisResult[]>>(`/${employeeURL}/${id}/employee-images`),
    registrationFace: (id: number, data: FormData) => http.post<ApiResponse<boolean>>(`/${employeeURL}/regis-face/${id}`, data),
    updateRegisFace: (id: number, data: FormData) => http.put<ApiResponse<boolean>>(`/${employeeURL}/update-regis-face/${id}`, data)
};

export default faceRegisApiRequest;