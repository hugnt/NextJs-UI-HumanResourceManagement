"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import React, { useState } from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import calendarApiRequest from '@/apis/calendar.api';
import { useQuery } from '@tanstack/react-query';
import { FaPen } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import FormCRUD from './form-crud';
import { Calendar } from '@/data/schema/calendar.schema';
import { CRUD_MODE } from '@/data/const';
const pathList: Array<PathItem> = [
    {
        name: "TimeKeeping",
        url: "/time-keeping"
    },
    {
        name: "Work Shift",
        url: "/time-keeping/work-shift"
    },
];


const dayOfWeeks = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
const workShifts = ["Ca sáng", "Ca chiều", "Ca tối"]
const QUERY_KEY = {
    keyList: "calendar"
}
export default function page() {
    const [detail, setDetail] = useState<Calendar>({});
    const [openCRUD, setOpenCRUD] = useState<boolean>(false);
    const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);
    //List data query
    const listDataQuery = useQuery({
        queryKey: [QUERY_KEY.keyList],
        queryFn: () => calendarApiRequest.getList(),
    });

    //Function
    const handleAdd = (indexWorkShift: number, indexDayOfWeek: number) => {
        setOpenCRUD(true);
        setMode(CRUD_MODE.ADD);
        setDetail({
            day: indexDayOfWeek + 1,
            shiftTime: indexWorkShift + 1
        })
    }
    const handUpdate = (body: Calendar) => {
        setOpenCRUD(true);
        setMode(CRUD_MODE.EDIT);
        setDetail(body)
    }
    const handDelete = (body: Calendar) => {
        setOpenCRUD(true);
        setMode(CRUD_MODE.DELETE);
        setDetail(body)
    }
    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Position list</h2>
                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                </div>
            </div>
            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                <Table>
                    <TableCaption>Lịch làm việc cho nhân viên partime.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]"></TableHead>
                            {dayOfWeeks.map((dayOfWeek, index) => {
                                return <TableHead key={index}>{dayOfWeek}</TableHead>
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            workShifts.map((workShift, index) => {
                                var indexDay = 0;
                                return <TableRow key={index}>
                                    <TableCell className='h-[100px]'>{workShift}</TableCell>
                                    {
                                        dayOfWeeks.map((_, subIndex) => {
                                            let listShiftTimes = listDataQuery.data?.metadata![index]
                                            let stringShow = "";
                                            let iconAddShow = false;

                                            if (listShiftTimes != null
                                                && listShiftTimes.calendarResult[indexDay] != null
                                                && subIndex + 1 == listShiftTimes.calendarResult[indexDay].day) {
                                                let timeStart = listShiftTimes.calendarResult[indexDay].timeStart!.slice(0, 5);
                                                let timeEnd = listShiftTimes.calendarResult[indexDay].timeEnd!.slice(0, 5);
                                                indexDay++;
                                                stringShow = `${timeStart} - ${timeEnd}`
                                            } else {
                                                stringShow = "Chưa có"
                                                iconAddShow = true;
                                            }
                                            let calendar = listShiftTimes?.calendarResult[indexDay - 1]
                                            return <TableCell key={subIndex} className='h-[100px]'>
                                                <div className='flex items-center justify-between'>
                                                    <p>{stringShow}</p>
                                                    <div>
                                                        {iconAddShow ?
                                                            <FaPlusCircle onClick={() => handleAdd(index, subIndex)} className='text-[14px] mr-10 mb-2 transition-transform duration-200 transform hover:font-bold hover:scale-110 cursor-pointer' /> :
                                                            <>
                                                                <FaPen onClick={() => handUpdate(calendar!)} className='text-[14px] mr-10 mb-4 transition-transform duration-200 transform hover:font-bold hover:scale-110 cursor-pointer' />
                                                                <FaTrashAlt onClick={() => handDelete(calendar!)} className='text-[14px] mr-10 transition-transform duration-200 transform hover:font-bold hover:scale-110 cursor-pointer' />
                                                            </>}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        })
                                    }
                                </TableRow>
                            })
                        }
                    </TableBody>
                </Table>
                
            </div>
            {<FormCRUD detail={detail} openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode}/>}
        </>
    )
}
