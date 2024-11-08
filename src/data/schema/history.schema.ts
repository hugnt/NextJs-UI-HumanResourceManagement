

export type HistoryResult = {
    id: number,
    timeSweep: string
    employeeId: number,
    statusHistory: StatusHistory
}

export enum StatusHistory {
    In = 1,
    Out = 2
}

export type HistoryUpsert = {
    statusHistory: StatusHistory,
    timeSweep: string
}