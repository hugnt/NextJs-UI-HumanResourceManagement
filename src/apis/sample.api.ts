import { Person } from "@/data/schema/sample.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const sampleApiRequest = {
    getList: () => http.get<ApiResponse<Person[]>>('/samples'),
    getDetail: (id: number) =>
      http.get<ApiResponse<Person>>(`/sample/${id}`, {
        cache: 'no-store'
    }),
    create: (body: Person) => http.post<ApiResponse<boolean>>('/sample', body),
    update: (id: number, body: Person) => http.put<ApiResponse<boolean>>(`/sample/${id}`, body),
    uploadImage: (body: FormData) => http.post<ApiResponse<boolean>>('/media/upload', body),
    delete: (id: number) => http.delete<ApiResponse<Person>>(`/sample/${id}`)
}
export default sampleApiRequest;