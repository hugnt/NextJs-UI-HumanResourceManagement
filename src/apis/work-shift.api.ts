import { HistoryCheckResult, HistoryUpsert } from "@/data/schema/history.schema";
import { CalendarEntry, EmployeeAttendanceRecord, PartimePlanResult, StatusCalendar, UserCalendarResult, WorkPlanInsert } from "@/data/schema/work-shift.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const workShift = "work-shifts"
const workShiftApiRequest = {
    registerShift: (workPlanInsert: WorkPlanInsert) => http.post<ApiResponse<boolean>>(`/${workShift}/register-shift`, workPlanInsert),
    getAllPartimePlans: () => http.get<ApiResponse<PartimePlanResult[]>>(`/${workShift}/get-all-partimeplans`),
    getAllPartimePlanByCurrentEmployeeId: () => http.get<ApiResponse<PartimePlanResult[]>>(`/${workShift}/get-partimeplans-by-current-employee`),
    getAllWorkShiftByPartimeEmployee: (employeeId: number, startDate: string, endDate: string) => http.get<ApiResponse<CalendarEntry[][]>>(`/${workShift}/get-all-user-calendar-by-employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`),
    getAllWorkShiftByPartimePlanId: (partimePlanId: number) => http.get<ApiResponse<UserCalendarResult[]>>(`/${workShift}/get-all-workshifts/${partimePlanId}`),
    getDetailPartimePlan: (partimePlanId: number) => http.get<ApiResponse<PartimePlanResult>>(`/${workShift}/get-partimeplan/${partimePlanId}`),
    processPartimePlanRequest: (partimePlanId: number, statusCalendar: StatusCalendar) => http.put<ApiResponse<boolean>>(`/${workShift}/process-partimeplan/${partimePlanId}?statusCalendar=${statusCalendar}`, {}),
    printPartimeWorkShiftToExcel: (employeeId: number, startDate: string, endDate: string) => http.post<ApiResponse<boolean>>(`/${workShift}/print-partime-work-shift-to-excel/${employeeId}?startDate=${startDate}&endDate=${endDate}`, {}),
    printFullTimeAttendanceToExcel: (employeeId: number, startDate: string, endDate: string) => http.post<ApiResponse<boolean>>(`/${workShift}/print-fulltime-attendance-to-excel/${employeeId}?startDate=${startDate}&endDate=${endDate}`, {}),
    checkInOutEmployee: (employeeId: number, historyAdd: HistoryUpsert) => http.post<ApiResponse<HistoryCheckResult>>(`/${workShift}/check-in-out-employee/${employeeId}`, historyAdd),
    updateHistoryAttendance: (id: number, historyUpdate: HistoryUpsert) => http.put<ApiResponse<boolean>>(`/${workShift}/history/${id}`, historyUpdate),
    getAllWorkShiftByFullTimeEmployee: (employeeId: number, startDate: string, endDate: string) => http.get<ApiResponse<EmployeeAttendanceRecord[]>>(`/${workShift}/get-all-attendance-by-fulltime-employee/${employeeId}?startDate=${startDate}&endDate=${endDate}`),
}
export default workShiftApiRequest;