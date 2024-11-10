"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label';
import DatePickerCustom from '@/components/custom/_date-picker';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox';
import { useMutation, useQuery } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
import { addDays, extractDateInfo, getDayOfWeek, WorkShift } from '../page';
import { ShiftTime } from '@/data/schema/calendar.schema';
import { Button } from '@/components/custom/button';
import { StatusCalendar } from '@/data/schema/work-shift.schema';
import { Input } from '@/components/ui/input';
import { handleSuccessApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
const pathList: Array<PathItem> = [
    {
        name: "TimeKeeping",
        url: "/time-keeping"
    },
    {
        name: "Register Shift",
        url: "/time-keeping/work-shift"
    },
];
const backButton: Array<PathItem> = [
    {
        name: "Back to partime plan",
        url: "/time-keeping/partime-plan"
    },
    {
        name: "",
        url: "/time-keeping/partime-plan"
    }
];

const KEY = {
    KEY_DETAIL: 'detail-partimeplan',
    KEY_LIST: 'user-calendar',
    MUTATE_KEY: 'process-partimeplan'
}
export default function page({ params }: { params: { partimePlanId: number } }) {
    const router = useRouter();
    const [calendars, setCalendars] = useState<WorkShift[]>([])
    const dataDetailPartimePlan = useQuery({
        queryKey: [KEY.KEY_DETAIL],
        queryFn: () => workShiftApiRequest.getDetailPartimePlan(params.partimePlanId)
    })
    const listDataUserCalendar = useQuery({
        queryKey: [KEY.KEY_LIST],
        queryFn: () => workShiftApiRequest.getAllWorkShiftByPartimePlanId(params.partimePlanId)
    })

    const processPartimePlan = useMutation({
        mutationKey: [KEY.MUTATE_KEY],
        mutationFn: (statusCalendar: StatusCalendar) => workShiftApiRequest.processPartimePlanRequest(params.partimePlanId, statusCalendar),
        onSuccess(data) {
            if (data.isSuccess) {
                handleSuccessApi({ message: "Successfully processed" })
                router.push('/time-keeping/partime-plan');
            }
        },
    })

    useEffect(() => {
        // Check if dataDetailPartimePlan and listDataUserCalendar are still loading or encountered an error
        if (dataDetailPartimePlan.isLoading || listDataUserCalendar.isLoading) {
            return; // Early return if still loading
        }

        if (dataDetailPartimePlan.isError || listDataUserCalendar.isError) {
            console.error("Error loading data");
            return; // Handle error case as needed
        }

        // Safely access metadata now that we know data is available
        const data = dataDetailPartimePlan.data?.metadata;
        const listData = listDataUserCalendar.data?.metadata;

        if (!data || !listData) {
            console.error("Metadata is undefined");
            return; // Handle undefined metadata case
        }

        const length = data.diffTime;
        const workShifts: WorkShift[] = [];
        let index = 0;

        for (let i = 0; i <= length; i++) {
            const start: Date = new Date(data.timeStart);
            const dayOfWeek = addDays(start, i);
            const { day, month, year } = extractDateInfo(dayOfWeek);

            const workShift: WorkShift = {
                day: getDayOfWeek(dayOfWeek) + " - " + `${day}/${month}/${year}`,
                isCheckMorning: false,
                isCheckAfternoon: false,
                isCheckEvening: false
            };

            // Only process shifts if the index is valid
            if (index < listData.length && listData[index].presentShift === `${year}-${month}-${day}`) {
                if(listData[index].shiftTime === ShiftTime.Morning){
                    workShift.isCheckMorning = true;
                    index ++
                }
                if(listData[index].shiftTime === ShiftTime.Afternoon){
                    workShift.isCheckAfternoon = true;
                    index ++
                }
                if(listData[index].shiftTime === ShiftTime.Evening){
                    workShift.isCheckEvening = true;
                    index ++
                }
            }

            workShifts.push(workShift);
            
        }
        console.log(workShifts)

        // Only update state if workShifts has changed
        setCalendars(workShifts);
    }, [listDataUserCalendar.data, dataDetailPartimePlan.data]); // Use specific parts of the data as dependencies

    return (
        <>
            {
                listDataUserCalendar.isLoading || dataDetailPartimePlan.isLoading ? <></> :
                    <div>
                        <div className='flex items-center justify-between'>
                            <div className='mb-2 flex items-center justify-between space-y-2'>
                                <div>
                                    <h2 className='text-2xl font-bold tracking-tight'>Register Shift</h2>
                                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                                </div>
                            </div>
                            <Link href={`/time-keeping/partime-plan`}>
                                <AppBreadcrumb pathList={backButton} className="mt-2" />
                            </Link>
                        </div>

                        <div id="date-range-picker" date-rangepicker className="flex items-center w-full mt-6">
                            <div className="grid w-1/4 max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Start Date</Label>
                                <DatePickerCustom date={new Date(dataDetailPartimePlan.data!.metadata!.timeStart)} disable={true} />
                            </div>
                            <div className="grid w-1/4 max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">End Date</Label>
                                <DatePickerCustom date={new Date(dataDetailPartimePlan.data!.metadata!.timeEnd)} disable={true} />
                            </div>
                            <div className="grid w-1/5 max-w-sm items-center gap-1.5">
                                <Label htmlFor="email">Employee Name</Label>
                                <Input value={dataDetailPartimePlan.data?.metadata?.employeeName} disabled={true} />
                            </div>
                            <div className="grid w-1/5 max-w-sm items-center gap-1.5 ml-12">
                                <Label htmlFor="email">Time Send</Label>
                                <Input value={dataDetailPartimePlan.data?.metadata?.createdAt} disabled={true} />
                            </div>
                        </div>
                        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mb-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Day</TableHead>
                                        <TableHead>Morning</TableHead>
                                        <TableHead>Afternoon</TableHead>
                                        <TableHead>Evening</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {calendars.map((calendar, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="h-[70px]">{calendar.day}</TableCell>
                                            <TableCell className="h-[70px]">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms"
                                                        checked={calendar.isCheckMorning}
                                                        disabled={true} />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Morning Shift
                                                    </label>
                                                </div>
                                            </TableCell>
                                            <TableCell className="h-[70px]">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms"
                                                        checked={calendar.isCheckAfternoon}
                                                        disabled={true}
                                                    />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Afternoon Shift
                                                    </label>
                                                </div>
                                            </TableCell>
                                            <TableCell className="h-[70px]">
                                                <div className="flex items-center space-x-2">
                                                    <Checkbox id="terms"
                                                        checked={calendar.isCheckEvening}
                                                        disabled={true} />
                                                    <label
                                                        htmlFor="terms"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Evening Shift
                                                    </label>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {
                                
                                dataDetailPartimePlan.data!.metadata!.statusCalendar == StatusCalendar.Submit ?
                                    <div className='flex item-center justify-end mt-6 ml-6'>
                                        <Button loading={processPartimePlan.isPending} onClick={() => processPartimePlan.mutate(StatusCalendar.Approved)} variant="default" className='mt-3'>Approved</Button>
                                        <Button loading={processPartimePlan.isPending} onClick={() => processPartimePlan.mutate(StatusCalendar.Refuse)} variant="destructive" className='mt-3 ml-3'>Refuse</Button>
                                    </div>
                                    : dataDetailPartimePlan.data!.metadata!.statusCalendar == StatusCalendar.Refuse ?
                                        <div className='flex item-center justify-end mt-6 ml-6'>
                                            <Button disabled={true} variant="destructive" className='mt-3'>Refused</Button>
                                        </div> : dataDetailPartimePlan.data!.metadata!.statusCalendar == StatusCalendar.Approved ?
                                            <div className='flex item-center justify-end mt-6 ml-6'>
                                                <Button disabled={true} variant="default" className='mt-3'>Approved</Button>
                                            </div> : <div className='flex item-center justify-end mt-6 ml-6'>
                                                <Button disabled={true} variant="destructive" className='mt-3'>Cancel</Button>
                                            </div>
                            }


                        </div>
                    </div>
            }

        </>
    )
}
