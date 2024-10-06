import { TaxDeduction } from "@/data/schema/taxDeduction.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const taxDeductionApiRequest = {
    getList: () => http.get<ApiResponse<TaxDeduction[]>>('/tax-deductions'),
    getDetail: (id: number) => http.get<ApiResponse<TaxDeduction>>(`/tax-deductions/${id}`),
    create: (body: TaxDeduction) => http.post<ApiResponse<boolean>>('/tax-deductions', body),
    update: (id: number, body: TaxDeduction) => http.put<ApiResponse<boolean>>(`/tax-deductions/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<TaxDeduction>>(`/tax-deductions/${id}`)
}
export default taxDeductionApiRequest;