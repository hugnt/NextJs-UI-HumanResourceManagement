"use client"
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CiCirclePlus } from "react-icons/ci";
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
import { StatusHistory } from '@/data/schema/history.schema';
import { Input } from '@/components/ui/input';
import { QueryClient, useMutation } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
import { Button } from '@/components/custom/button';
import { handleSuccessApi } from '@/lib/utils';
const QUERY_KEY = {
    keyList: "employee-work-shift",
    mutationKey: "print-work-shift"
}
type Props = {
    date: string,
    update: number,
    setUpdate: (value: number) => void
}
export default function DialogAddAttendance({ date, update, setUpdate }: Props) {
    const [status, setStatus] = useState<StatusHistory>();
    const [time, setTime] = useState<string>("");
    const onChangeStatus = (value: string) => {
        if (value == "1") setStatus(StatusHistory.In);
        else setStatus(StatusHistory.Out);
    }
    const { mutate, isPending } = useMutation({
        mutationKey: ["add-attendance"],
        mutationFn: () => {
            if (time === "" || status === undefined) {
                // Return a resolved promise with a dummy response to satisfy TypeScript's requirement
                return Promise.resolve({ isSuccess: false });
            }
            return workShiftApiRequest.checkInOutEmployee(
                1,
                {
                    statusHistory: status,
                    timeSweep: `${date}T${time}:00` // Concatenate date, time, and seconds
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
        <>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <CiCirclePlus className='ml-4 hover:text-blue-500 dark:hover:text-blue-400 cursor-pointer' />
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            This add a attendance of employee partime
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
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
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="email">Choose time</Label>
                            <Input
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                id='time'
                                type="time"
                                className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="00:00:00" max="23:59:00" required
                            />
                        </div>
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Button loading={isPending} onClick={() => mutate()}>Save</Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
