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
import { ShiftTime } from '@/data/schema/calendar.schema';
import { Button } from '@/components/custom/button';
import { StatusHistory } from '@/data/schema/history.schema';
const months = ["",
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
const workShifts = ["Morning", "Afternoon", "Evening"]
const QUERY_KEY = {
    keyList: "employee-work-shift",
    mutationKey: "print-work-shift"
}
export default function page() {
    const queryClient = useQueryClient()
    const [month, setMonth] = useState<number>(new Date().getMonth() + 1); //0-11 month
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const getYearsChoose = (): number[] => {
        const currentYear = new Date().getFullYear();
        const years = [];

        for (let i = 5; i >= 0; i--) {
            years.push(currentYear - i);
        }
        years.push(currentYear + 1)

        return years;
    }
    const getShiftTimeKey = (index: number): ShiftTime => {
        switch (index) {
            case 0:
                return ShiftTime.Morning;
            case 1:
                return ShiftTime.Afternoon;
            case 2:
                return ShiftTime.Evening;
            default:
                throw new Error(`Invalid index: ${index}`);
        }
    };


    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEY.keyList],
        queryFn: () => workShiftApiRequest.getAllWorkShiftByPartimeEmployee(-1, `${month < 10 ? "0" : ""}${month}-${year}`),
    });

    const { mutate, isPending } = useMutation({
        mutationKey: [QUERY_KEY.mutationKey],
        mutationFn: () => workShiftApiRequest.printPartimeWorkShiftToExcel(-1, `${month < 10 ? "0" : ""}${month}-${year}`)
    })
    console.log(month)





    
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
                        <Label htmlFor="email">Month</Label>
                        <Select
                            onValueChange={(e) => setMonth(parseInt(e))}
                            defaultValue={month.toString()}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select month" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Month</SelectLabel>
                                    {
                                        months.map((item, index) => { //1 - 12
                                            if(index > 0){
                                                return <SelectItem key={index} value={`${index}`}>{item}</SelectItem>
                                            }                                            
                                        })
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid w-1/4 max-w-sm items-center gap-1.5 ml-4">
                        <Label htmlFor="email">Year</Label>
                        <Select
                            onValueChange={(e) => setYear(parseInt(e))}
                            defaultValue={year.toString()}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Year</SelectLabel>
                                    {
                                        getYearsChoose().map((item, index) => {
                                            return <SelectItem key={index} value={`${item}`}>{item}</SelectItem>
                                        })
                                    }
                                </SelectGroup>
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
                                        return <TableHead key={subIndex}>{day.dayOfWeek} ~ {day.date.slice(5)}</TableHead>
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
                                                if (day.userCalendarResult != null &&
                                                    day.userCalendarResult[subIndex] != null) {
                                                    color = "bg-green-600"
                                                }
                                                if (day.historyEntryResults != null &&
                                                    day.historyEntryResults[getShiftTimeKey(subIndex)].length >= 2) {
                                                    let history = day.historyEntryResults[getShiftTimeKey(subIndex)];
                                                    ClockIn = <div className="max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                                        <div className='flex items-center justify-between'>
                                                            <p className="mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">First Sweep : {history.at(0)!.statusHistory == StatusHistory.In ? "In" : "Out"}-{history.at(0)!.timeSweep}</p>
                                                        </div>
                                                    </div>
                                                    ClockOut = <div className="max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                                        <div className='flex items-center justify-between'>
                                                            <p className="mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">Last Sweep : {history.at(-1)!.statusHistory == StatusHistory.In ? "In" : "Out"}-{history.at(-1)!.timeSweep}</p>
                                                        </div>
                                                    </div>
                                                    detailHistory = "Show detail history"
                                                }
                                                return <TableCell className={`border ${color}`} key={subSubIndex}>
                                                    {ClockIn}
                                                    <p className='mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white text-center'>{detailHistory}</p>
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
