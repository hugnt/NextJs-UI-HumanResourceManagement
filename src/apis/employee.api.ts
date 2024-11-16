import { Employee, ProfileDetail, TypeResult } from "@/data/schema/employee.schema"; // Đảm bảo đường dẫn chính xác
import { Chart, ChartResult, PageFlexibleDashboardResult } from "@/data/schema/flexibleDashboard.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const employeeApiRequest = {
    getList: () => http.get<ApiResponse<Employee[]>>('/employees'),
    getDetail: (id: number) => http.get<ApiResponse<Employee>>(`/employees/${id}`),
    create: (body: Employee) => http.post<ApiResponse<boolean>>('/employees', body),
    update: (id: number, body: Employee) => http.put<ApiResponse<boolean>>(`/employees/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<Employee>>(`/employees/${id}`),
    getCurrentUserProfile: () => http.get<ApiResponse<ProfileDetail>>('/employees/current-profile'),
    flexibleDashboard: () => http.get<ApiResponse<Record<string, TypeResult>[]>>('dashboards/flexible-dashboard'),
    getAllFlexibleDashboard: () => http.get<ApiResponse<PageFlexibleDashboardResult[]>>('dashboards/all-flexible-dashboards'),
    createNewPageFlexibleDashboard: () => http.post<ApiResponse<PageFlexibleDashboardResult>>('dashboards/create-flexible-dashboards', {}),
    getAllChartByPageFlexibleId: (pageId: number) => http.get<ApiResponse<ChartResult[]>>(`dashboards/${pageId}/charts`),
    createNewChart: (value: Chart) => http.post<ApiResponse<boolean>>(`dashboards/charts`, value),
    getDetailByContractId: (contractId: number) => http.get<ApiResponse<Employee>>(`/employees/contract/${contractId}`),
    getAllContractNotInUsed: () => http.get<ApiResponse<number[]>>(`/employees/contract/not-inused`),
};

export default employeeApiRequest;