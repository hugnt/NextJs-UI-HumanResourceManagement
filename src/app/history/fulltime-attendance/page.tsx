"use client"
import { useCurrentUser } from '@/app/system/ui/auth-context';
import React, { useState } from 'react'
import { DateRange } from 'react-day-picker';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import { Label } from '@/components/ui/label';
import { DatePickerRange } from '@/components/custom/date-picker-range';
import { Button } from '@/components/custom/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
import DialogAddAttendance from '../attendance-tracking/dialog-add-attendance';
import { Role } from '@/data/schema/auth.schema';
import { StatusHistory } from '@/data/schema/history.schema';
import DialogAttendance from '../attendance-tracking/dialog-attendance';
const pathList: Array<PathItem> = [
    {
        name: "History",
        url: "/time-keeping"
    },
    {
        name: "FullTime Attendance",
        url: "/history/fulltime-attendance"
    },
];
const QUERY_KEY = {
    keyList: "employee-work-shift",
    mutationKey: "print-work-shift"
}
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export default function FullTimeAttendance({employeeId} : {employeeId?: number}) {
    const user = useCurrentUser().currentUser!;
    let id = employeeId == null ? user.id : employeeId;
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

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEY.keyList, update],
        queryFn: () => {
            let startDate = new Date(dateRange?.from!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            let endDate = new Date(dateRange?.to!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return workShiftApiRequest.getAllWorkShiftByFullTimeEmployee(id, startDate!, endDate!)
        },
    });
    const { mutate, isPending } = useMutation({
        mutationKey: [QUERY_KEY.mutationKey],
        mutationFn: () => {
            let startDate = new Date(dateRange?.from!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            let endDate = new Date(dateRange?.to!.getTime()! + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            return workShiftApiRequest.printFullTimeAttendanceToExcel(id, startDate!, endDate!)
        }
    })
    const getDays = (value: string): string[] => {
        let length = daysOfWeek.length
        let dataReturn: string[] = [];
        for (let i = 0; i < length; i++) {
            if (daysOfWeek[i] == value) {
                break;

            }
            dataReturn.push("")
        }
        return dataReturn
    }
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
            <div className="lg:flex lg:h-full lg:flex-col mt-4 mb-4">
                <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
                    <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
                        {
                            daysOfWeek.map((item, index) => {
                                return <div key={index} className="flex justify-center bg-white py-2">
                                    <span>{item[0]}</span>
                                    <span className="sr-only sm:not-sr-only">{item.slice(1)}</span>
                                </div>
                            })
                        }
                    </div>
                    <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
                        <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
                            {
                                data != null ?
                                    getDays(data?.metadata![0].dayOfWeek.slice(0, 3)).map((_, index) => {
                                        return <div key={index} className="relative bg-gray-50 px-3 py-2 text-gray-500"></div>
                                    }) :
                                    <></>
                            }
                            {
                                data?.metadata?.map((item, index) => {
                                    return <div key={index} className="relative bg-gray-50 px-3 py-2 text-gray-500">
                                        <div className='flex items-center justify-between'>
                                            <time dateTime={item.date}>{item.date.slice(8)}</time>
                                            {user?.role == Role.Admin ? <DialogAddAttendance
                                                date={item.date}
                                                update={update}
                                                setUpdate={setUpdate} /> : <></>}
                                        </div>

                                        <ol className="mt-2">
                                            {
                                                item.historyResults.map((subItem, subIndex) => {
                                                    if (subIndex > 0 && subIndex < item.historyResults.length - 1) return;
                                                    return <li>
                                                        <a key={subIndex} href="#" className="group flex">
                                                            <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">{subIndex == 0 ? "First " : "Last "}Sweep {subItem.statusHistory == StatusHistory.In ? " In" : " Out"}</p>
                                                            <time dateTime="2022-01-08T18:00" className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block">{subItem.timeSweep.slice(11)}</time>
                                                        </a>
                                                    </li>
                                                })
                                            }
                                            {
                                                item.historyResults.length > 0 ?
                                                    <DialogAttendance
                                                        date={item.date}
                                                        detailHistory='Show detail history'
                                                        update={update}
                                                        setUpdate={setUpdate}
                                                        role={user!.role}
                                                        history={item.historyResults}
                                                    /> : <></>
                                            }
                                        </ol>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
