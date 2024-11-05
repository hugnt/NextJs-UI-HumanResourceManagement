export type HistoryResult = {
    timeSweep:string
    employeeId: number,
    statusHistory: StatusHistory
}

export enum StatusHistory{
    In = 1,
    Out = 2
}