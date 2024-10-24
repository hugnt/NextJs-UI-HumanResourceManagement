import { ShiftTime } from "./calendar.schema"

export type WorkPlanInsert = {
    timeStart: string,
    timeEnd: string,
    statusCalendar: StatusCalendar,
    dayWorks?: UserCalendarInsert[]
}

export type UserCalendarInsert = {
    presentShift: string,
    shiftTime: ShiftTime
}

export type PartimePlanResult = {
    timeStart: string,
    timeEnd: string,
    statusCalendar: StatusCalendar,
    createdAt: string,
    employeeName: string,
    diffTime: number,
    id: number
}

export type UserCalendarResult = UserCalendarInsert & {
    userCalendarStatus: UserCalendarStatus
}

export enum StatusCalendar {
    Draft = 1,
    Submit = 2,
    Approved = 3,
    Refuse = 4,
    Cancel = 5
}

export enum UserCalendarStatus {
    Submit = 1,
    Approved = 2,
    Inactive = 3,
}