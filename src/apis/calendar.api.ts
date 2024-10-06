import { Calendar, ShiftGroup } from "@/data/schema/calendar.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";

const calendarURL: string = "calendars";
const calendarApiRequest = {
    getList: () => http.get<ApiResponse<ShiftGroup[]>>(`/${calendarURL}`),
    create: (body: Calendar) => http.post<ApiResponse<boolean>>(`/${calendarURL}`, body),
    update: (id: number, body: Calendar) => http.put<ApiResponse<boolean>>(`/${calendarURL}/${id}`, body),
    delete: (id: number) => http.delete<ApiResponse<boolean>>(`/${calendarURL}/${id}`)
}
export default calendarApiRequest;