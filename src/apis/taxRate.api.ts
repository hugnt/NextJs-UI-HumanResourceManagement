import { TaxRate } from "@/data/schema/taxRate.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const taxRateApiRequest = {
    getList: () => http.get<ApiResponse<TaxRate[]>>('/tax-rates'),
    getDetail: (id: number) => http.get<ApiResponse<TaxRate>>(`/tax-rates/${id}`),
    create: (body: TaxRate) => http.post<ApiResponse<boolean>>('/tax-rates', body),
    update: (id: number, body: TaxRate) => http.put<ApiResponse<boolean>>(`/tax-rates/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<TaxRate>>(`/tax-rates/${id}`)
}
export default taxRateApiRequest;