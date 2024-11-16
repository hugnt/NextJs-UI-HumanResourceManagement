import { LeaveApplication, Contract, ListSalary, ApplicantByPosition } from "@/data/schema/dashboard.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const dashboardApiRequest = {
    getJobPostingCount: () => http.get<ApiResponse<number>>('/dashboards/job-posting-count'),
    getApplicantCount: () => http.get<ApiResponse<number>>('/dashboards/applicant-count'),
    getEmployeeCountByBaseSalary: () => http.get<ApiResponse<ListSalary[]>>('/dashboards/employee-count-by-base-salary'),
    getApplicantCountByPosition: () => http.get<ApiResponse<ApplicantByPosition[]>>('/dashboards/applicant-count-by-position'),
    getLeaveApplicationsToday: () => http.get<ApiResponse<LeaveApplication[]>>('/dashboards/leave-applications-today'),
    getExpiringContracts: (expirationDate: string) => http.get<ApiResponse<Contract[]>>(`/dashboards/expiring-contracts?expirationDate=${expirationDate}`),
    getAdvanceCountByPeriod: (start: string, end: string) => http.get<ApiResponse<number>>(`/dashboards/advances-by-pay-period?start=${start}&end=${end}`)
};

export default dashboardApiRequest;