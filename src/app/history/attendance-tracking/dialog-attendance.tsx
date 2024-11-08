"use client"
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { HistoryResult, StatusHistory } from '@/data/schema/history.schema'
import { Role } from '@/data/schema/auth.schema'
import { FaPen } from "react-icons/fa";
type Props = {
    date: string,
    detailHistory: string,
    history: HistoryResult[] | undefined,
    role: Role,
    update: number,
    setUpdate: (value: number) => void
}
import { FaDeleteLeft } from "react-icons/fa6";
import { FaRegCheckCircle } from "react-icons/fa";
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input'
import { useMutation } from '@tanstack/react-query'
import workShiftApiRequest from '@/apis/work-shift.api'
import { handleSuccessApi } from '@/lib/utils'
export default function DialogAttendance({ date, detailHistory, history, role, update, setUpdate }: Props) {
    const [status, setStatus] = useState<StatusHistory>();
    const [time, setTime] = useState<string>("");
    const [index, setIndex] = useState<number>(-1);
    const onChangeStatus = (value: string) => {
        if (value == "1") setStatus(StatusHistory.In);
        else setStatus(StatusHistory.Out);
    }
    const onShowDetailHistory = (index: number) => {
        setIndex(index)
        setStatus(history![index].statusHistory)
        setTime(history![index].timeSweep.slice(11))
    }
    const { mutate, isPending } = useMutation({
        mutationKey: ["update-attendance"],
        mutationFn: (id: number) => {
            if (time === "" || status === undefined) {
                // Return a resolved promise with a dummy response to satisfy TypeScript's requirement
                return Promise.resolve({ isSuccess: false });
            }
            console.log(status, `${date}T${time}:00`,id)
            return workShiftApiRequest.updateHistoryAttendance(
                id,
                {
                    statusHistory: status,
                    timeSweep: `${date}T${time}${time.length <=5 ? ":00" : ""}` // Concatenate date, time, and seconds
                }
            );
        },
        onSuccess: (data) => {
            if (data.isSuccess) {
                handleSuccessApi({ message: "Inserted Successfully!" });
                setUpdate(update + 1);
            }
        }
    });
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <p className="cursor-pointer mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white text-center hover:text-blue-500 dark:hover:text-blue-400">
                    {detailHistory}
                </p>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        This show all the sweep of a day {date.slice(5)}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {
                    history?.map((his, hisIndex) => {
                        return <div key={hisIndex} className='flex items-center justify-between'>
                            {hisIndex != index ? <div className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 flex items-center justify-center">
                                <div className="flex items-center justify-between">
                                    <p className="text-center mb-1 text-xs font-semibold tracking-tight text-gray-900 dark:text-white">
                                        Sweep At: {his.statusHistory == StatusHistory.In ? "In" : "Out"} - {his.timeSweep.slice(11)}
                                    </p>

                                </div>
                            </div> :
                                <div className='flex items-center justify-between'>
                                    <div className="grid w-full max-w-sm items-center gap-1.5">
                                        <Label htmlFor="email">Choose status</Label>
                                        <Select onValueChange={(e) => onChangeStatus(e)} value={status?.toString()}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Status</SelectLabel>
                                                    <SelectItem value={StatusHistory.In.toString()}>In</SelectItem>
                                                    <SelectItem value={StatusHistory.Out.toString()}>Out</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid w-full max-w-sm items-center gap-1.5 ml-6">
                                        <Label htmlFor="email">Choose time</Label>
                                        <Input
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            id='time'
                                            type="time"
                                            className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="00:00:00" max="23:59:00" required
                                        />
                                    </div>
                                </div>}
                            {role == Role.Admin ?
                                <>
                                    {
                                        hisIndex == index ? <div className="flex items-center justify-between">
                                            <FaDeleteLeft onClick={() => setIndex(-1)} className='ml-4 text-[18px] cursor-pointer text-gray-500 hover:text-blue-500' />
                                            <FaRegCheckCircle onClick={() => mutate(his.id)} className='ml-4 text-[18px] cursor-pointer text-gray-500 hover:text-blue-500' />
                                        </div> :
                                            <div className='flex items-center justify-end'>
                                                <FaPen
                                                    onClick={() => onShowDetailHistory(hisIndex)}
                                                    className="ml-4 text-[18px] cursor-pointer text-gray-500 hover:text-blue-500" />
                                            </div>
                                    }
                                </> : <></>}
                        </div>
                    })
                }
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
