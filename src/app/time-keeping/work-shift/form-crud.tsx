"use client"
import { CRUD_MODE } from '@/data/const'
import React, { useEffect } from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from '@tanstack/react-query'
import calendarApiRequest from '@/apis/calendar.api'
import { handleErrorApi, handleSuccessApi } from '@/lib/utils'
import { Calendar, calendarSchema } from '@/data/schema/calendar.schema'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PiTrashLight } from 'react-icons/pi';
type Props = {
    openCRUD: boolean,
    mode: CRUD_MODE,
    setOpenCRUD: (openCRUD: boolean) => void,
    size?: number,
    detail?: Calendar
}
const KEY = {
    keyList: "calendar",
    keyCreate: "create-calendar",
    keyUpdate: "update-calendar",
    keyDelete: "remove-calendar"
}
const dayOfWeeks = ["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy"]
const workShifts = ["Ca sáng", "Ca chiều", "Ca tối"]
export default function FormCRUD(props: Props) {
    const { openCRUD = false, setOpenCRUD = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = {} } = props;

    //Mutation
    const queryClient = useQueryClient();
    const addDataMutation = useMutation({
        mutationKey: [KEY.keyCreate],
        mutationFn: (body: Calendar) => calendarApiRequest.create(body),
        onSuccess: (data) => {
            if (data.isSuccess) {
                queryClient.invalidateQueries({ queryKey: [KEY.keyList] })
                handleSuccessApi({ message: "Inserted Successfully!" });
                setOpenCRUD(false)
            } else {
                handleErrorApi({ error: data.message })
            }

        }
    });

    const updateDataMutation = useMutation({
        mutationKey: [KEY.keyUpdate],
        mutationFn: ({ id, body }: { id: number, body: Calendar }) => calendarApiRequest.update(id, body),
        onSuccess: (data) => {
            if (data.isSuccess) {
                queryClient.invalidateQueries({ queryKey: [KEY.keyList] })
                handleSuccessApi({ message: "Updated Successfully!" });
                setOpenCRUD(false)
            } else {
                handleErrorApi({ error: data.message })
            }

        }
    });

    const deleteDataMutation = useMutation({
        mutationKey: [KEY.keyDelete],
        mutationFn: (id: number) => calendarApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [KEY.keyList] })
            handleSuccessApi({ message: "Deleted Successfully!" });
            setOpenCRUD(false)
        }
    });

    //Form
    const form = useForm<Calendar>({
        resolver: zodResolver(calendarSchema),
        defaultValues: detail,
    });

    const onSubmit = (data: Calendar) => {
        //Convert data
        data.timeStart = data.timeStart!.length == 5 ? data.timeStart + ":00" : data.timeStart
        data.timeEnd = data.timeEnd!.length == 5 ? data.timeEnd + ":00" : data.timeEnd
        console.log(data.timeStart, data.timeEnd)
        if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
        else if (mode == CRUD_MODE.EDIT) updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
        else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);


    }

    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenCRUD(false);
    };
    // #endregion

    useEffect(() => {
        if (Object.keys(detail).length > 0) {
            form.reset(detail);
        }
    }, [detail, mode, openCRUD])

    return (
        <div>
            <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
                {mode != CRUD_MODE.DELETE ? <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Lịch làm việc</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                            <div className="p-2 text-sm space-y-3">
                                <Input value={dayOfWeeks[detail.day! - 1]} disabled={true} />
                                <Input value={workShifts[detail.shiftTime! - 1]} disabled={true} />
                                <div className='w-full mx-auto grid grid-cols-2 gap-4'>
                                    <FormField
                                        control={form.control}
                                        name="timeStart"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Thời gian bắt đầu</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <Input type="time" {...field} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="08:00:00" max="22:00:00" required />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="timeEnd"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>Thời gian kết thúc</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clip-rule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        <Input type="time" {...field} className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" min="08:00:00" max="22:00:00" required />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                            </div>
                            <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                                <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                                {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                                    <Button type="submit" size='sm'>Save</Button>}
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent> :
                    //DELETE FORM
                    <AlertDialogContent
                        className={`gap-0 top-[50%] border-none overflow-hidden p-0 w-[400px] sm:rounded-[0.3rem]`}>
                        <AlertDialogHeader>
                            <AlertDialogTitle></AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="text-center pt-8 pb-4 flex justify-center">
                            <PiTrashLight size={100} color="rgb(248 113 113)" />
                        </div>
                        <AlertDialogDescription className="text-center pb-4 text-lg text-stone-700">
                            Are you absolutely sure to delete?
                        </AlertDialogDescription>
                        <AlertDialogFooter className="!justify-center p-2 py-3 text-center">
                            <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                            <Button className="" size='sm' onClick={() => onSubmit(detail)}>Confirm</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                }
            </AlertDialog>

        </div>
    )
}


