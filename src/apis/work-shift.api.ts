import { CalendarEntry, PartimePlanResult, StatusCalendar, UserCalendarResult, WorkPlanInsert } from "@/data/schema/work-shift.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const workShift = "work-shifts"
const workShiftApiRequest = {
    registerShift: (workPlanInsert: WorkPlanInsert) => http.post<ApiResponse<boolean>>(`/${workShift}/register-shift`, workPlanInsert),
    getAllPartimePlans: () => http.get<ApiResponse<PartimePlanResult[]>>(`/${workShift}/get-all-partimeplans`),
    getAllWorkShiftByPartimeEmployee: (employeeId: number, monthYear: string) => http.get<ApiResponse<CalendarEntry[][]>>(`/${workShift}/get-all-user-calendar-by-employee/${employeeId}?monthYear=${monthYear}`),
    getAllWorkShiftByPartimePlanId: (partimePlanId: number) => http.get<ApiResponse<UserCalendarResult[]>>(`/${workShift}/get-all-workshifts/${partimePlanId}`),
    getDetailPartimePlan: (partimePlanId: number) => http.get<ApiResponse<PartimePlanResult>>(`/${workShift}/get-partimeplan/${partimePlanId}`),
    processPartimePlanRequest: (partimePlanId: number, statusCalendar: StatusCalendar) => http.put<ApiResponse<boolean>>(`/${workShift}/process-partimeplan/${partimePlanId}?statusCalendar=${statusCalendar}`, {}),
    printPartimeWorkShiftToExcel: (employeeId: number, monthYear: string) => http.post<ApiResponse<boolean>>(`/${workShift}/print-partime-work-shift-to-excel/${employeeId}?monthYear=${monthYear}`, {})
}
export default workShiftApiRequest;