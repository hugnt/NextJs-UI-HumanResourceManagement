"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import { Label } from '@/components/ui/label';
import React, { ReactNode, useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const pathList: Array<PathItem> = [
    {
        name: "History",
        url: "/time-keeping"
    },
    {
        name: "Attendance Tracking",
        url: "/history/attendance-tracking"
    },
];
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
import { ShiftTimeString } from '@/data/schema/calendar.schema';
import { Button } from '@/components/custom/button';
import { StatusHistory } from '@/data/schema/history.schema';
import { DatePickerRange } from '@/components/custom/date-picker-range';
import { DateRange } from "react-day-picker";
import DialogAttendance from './dialog-attendance';
import { useCurrentUser } from '@/app/system/ui/auth-context';
const workShifts = ["Morning", "Afternoon", "Evening"]
import { Role } from '@/data/schema/auth.schema';
import DialogAddAttendance from './dialog-add-attendance';
const QUERY_KEY = {
    keyList: "employee-work-shift",
    mutationKey: "print-work-shift"
}
export default function page() {
    const queryClient = useQueryClient()
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        to: new Date()
    });
    const [update, setUpdate] = useState<number>(0)
    const [period, setPeriod] = useState<string>(`${currenYear}/${currentMonth.toString().padStart(2, '0')}`);
    const handleChangePeriod = (period: string) => {
        const month = Number(period.split('/')[1]) - 1;
        const year = Number(period.split('/')[0]);

        let lastDayOfMonth;
        if (year === currenYear && month === currentMonth - 1) {
            lastDayOfMonth = currentDay;
        } else lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        const range: DateRange = {
            from: new Date(year, month, 1), // First day of the month
            to: new Date(year, month, lastDayOfMonth), // Last day of the month
        };
        setPeriod(period);
        setDateRange(range)
    }
    const user = useCurrentUser().currentUser;
    const getShiftTimeKey = (index: number): ShiftTimeString => {
        switch (index) {
            case 0:
                return ShiftTimeString.Morning;
            case 1:
                return ShiftTimeString.Afternoon;
            case 2:
                return ShiftTimeString.Evening;
            default:
                throw new Error(`Invalid index: ${index}`);
        }
    };


    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEY.keyList, update],
        queryFn: () => {
            let startDate = new Date(dateRange?.from!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            let endDate = new Date(dateRange?.to!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return workShiftApiRequest.getAllWorkShiftByPartimeEmployee(1, startDate!, endDate!)
        },
    });
    console.log(update)

    const { mutate, isPending } = useMutation({
        mutationKey: [QUERY_KEY.mutationKey],
        mutationFn: () => {
            let startDate = new Date(dateRange?.from!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            let endDate = new Date(dateRange?.to!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return workShiftApiRequest.printPartimeWorkShiftToExcel(1, startDate!, endDate!)
        }
    })
    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>History TimeKeeping</h2>
                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                </div>
            </div>
            <div>
                <div className="flex items-center w-full mt-6">
                    <div className="grid w-1/4 max-w-sm items-center gap-1.5">
                        <Label htmlFor="email">Choose date range</Label>
                        <DatePickerRange dateRange={dateRange} setDateRage={setDateRange} />
                    </div>
                    <div className="grid w-1/4 max-w-sm items-center gap-1.5 ml-4">
                        <Label htmlFor="email">Choose month</Label>
                        <Select value={period} onValueChange={(e) => handleChangePeriod(e)}>
                            <SelectTrigger className="w-[140px] h-8">
                                <SelectValue placeholder="Chọn kì lương" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Array.from({ length: currentMonth }, (_, i) => {
                                        const month = (currentMonth - i).toString().padStart(2, '0');
                                        return (
                                            <SelectItem key={i} value={`${currenYear}/${month}`}>
                                                {`${month}/${currenYear}`}
                                            </SelectItem>
                                        );
                                    })
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-1/4 max-w-sm items-center gap-1.5 ml-4">
                        <Button loading={isLoading} onClick={() => queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })} className='mt-4'>Show History Attendance</Button>
                    </div>
                    <div className="grid w-1/4 max-w-sm items-center gap-1.5 ml-4">
                        <Button onClick={() => mutate()} loading={isPending} className='mt-4 bg-green-500'>Extract to Excel</Button>
                    </div>
                </div>
            </div>
            <div className=''>
                {
                    data?.metadata?.map((week, index) => {
                        return <Table key={index} className='mt-6 mb-10 border-b border-gray-300'>
                            <TableCaption>Lịch làm việc cho nhân viên partime.</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]"></TableHead>
                                    {week.map((day, subIndex) => {
                                        return <TableHead key={subIndex}>
                                            <div className='flex items-center justify-start'>
                                                <p>{day.dayOfWeek} ~ {day.date.slice(5)}</p>
                                                {user?.role == Role.Admin ? <DialogAddAttendance
                                                    date={day.date}
                                                    update={update}
                                                    setUpdate={setUpdate} /> : <></>}
                                            </div>

                                        </TableHead>
                                    })}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {
                                    workShifts.map((workShift, subIndex) => {
                                        return <TableRow key={subIndex}>
                                            <TableCell className='h-[100px]'>{workShift}</TableCell>
                                            {week.map((day, subSubIndex) => {
                                                let color: string = ""
                                                let ClockIn: ReactNode = null;
                                                let ClockOut: ReactNode = null;
                                                let detailHistory: string = "";
                                                let history;
                                                if (day.userCalendarResult != null &&
                                                    day.userCalendarResult[subIndex] != null) {
                                                    color = "bg-green-600"
                                                }
                                                if (day.historyEntryResults != null &&
                                                    day.historyEntryResults[getShiftTimeKey(subIndex)] != null) {
                                                    history = day.historyEntryResults[getShiftTimeKey(subIndex)];
                                                    ClockIn = <div className="w-[1/2] p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center">
                                                        <div className='flex items-center justify-between'>
                                                            <p className="text-center mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">First Sweep : {history.at(0)!.statusHistory == StatusHistory.In ? "In" : "Out"} - {history.at(0)!.timeSweep.slice(11)}</p>
                                                        </div>
                                                    </div>
                                                    {
                                                        history.length > 1 ? ClockOut = <div className="w-[1/2] p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center">
                                                            <div className="flex items-center justify-between">
                                                                <p className="text-center mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">
                                                                    Last Sweep: {history.at(-1)!.statusHistory == StatusHistory.In ? "In" : "Out"} - {history.at(-1)!.timeSweep.slice(11)}
                                                                </p>
                                                            </div>
                                                        </div> : <></>
                                                    }

                                                    detailHistory = "Show detail history"
                                                }
                                                return <TableCell className={`border ${color}`} key={subSubIndex}>
                                                    {ClockIn}
                                                    <DialogAttendance
                                                        date={day.date}
                                                        history={history}
                                                        detailHistory={detailHistory}
                                                        role={user!.role}
                                                        update={update}
                                                        setUpdate={setUpdate} />
                                                    {ClockOut}
                                                </TableCell>
                                            })}
                                        </TableRow>
                                    })
                                }
                            </TableBody>
                        </Table>
                    })
                }

            </div>
        </>
    )
}
