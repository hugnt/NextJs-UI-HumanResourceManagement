/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Advance, advanceDefault, advanceSchema } from "@/data/schema/advance.schema";
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
import { Input } from "@/components/ui/input"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import advanceApiRequest from "@/apis/advance.api";
import { handleSuccessApi } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import employeeApiRequest from "@/apis/employee.api";
type FormProps = {
    openAE: boolean,
    setOpenAE: (openAE: boolean) => void,
    size?: number,
    detail: Advance
}

//react query key
const QUERY_KEY = {
    keyList: "update-employee-payroll",
    keySub: "employees"
}

export default function FormAE(props: FormProps) {
    const { openAE, setOpenAE = () => { }, size = 600, detail = advanceDefault } = props;
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();


    // #region +TANSTACK QUERY
    const queryClient = useQueryClient();
    const updateDataMutation = useMutation({
        mutationFn: ({ id, body }: { id: number, body: Advance }) => advanceApiRequest.update(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenAE(false);
        }
    });


    const listDataEmployee = useQuery({
        queryKey: [QUERY_KEY.keySub],
        queryFn: () => employeeApiRequest.getList()
    });
    // #endregion

    // #region + FORM SETTINGS
    const form = useForm<Advance>({
        resolver: zodResolver(advanceSchema),
        defaultValues: advanceDefault,
    });

    const onSubmit = (data: Advance) => {
        updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    }

    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenAE(false);
    };
    // #endregion

    useEffect(() => {
        if (Object.keys(detail).length > 0) {
            form.reset(detail);
        }
    }, [detail, openAE])



    return (
        <div>
            <AlertDialog open={openAE} onOpenChange={setOpenAE} >
                <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Details</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                            <div className="p-2 text-sm space-y-3">
                                <FormField
                                    control={form.control}
                                    name="employeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nhân viên</FormLabel>
                                            <Select {...field}
                                                onValueChange={field.onChange}
                                                value={field.value?.toString()}>
                                                <FormControl >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Nhân viên cần ứng lương" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {
                                                        listDataEmployee.data?.metadata?.map((e, i) => {
                                                            return <SelectItem key={i} value={e.id?.toString() ?? "0"}>{e.name}</SelectItem>
                                                        })
                                                    }
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="payPeriod"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Kì lương</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    defaultValue={field.value?.toString()}
                                                    onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Chọn kì lương" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            Array.from({ length: currentMonth }, (v, i) => {
                                                                const month = (currentMonth - i).toString().padStart(2, '0');
                                                                return (
                                                                    <SelectItem key={i} value={`${month}/${currenYear}`}>
                                                                        {`${month}/${currenYear}`}
                                                                    </SelectItem>
                                                                );
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Advance Amount</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter advance amount"
                                                    type="number"
                                                    {...field}
                                                    value={field.value ?? ''}/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter why you need to advance the salary" {...field} value={field.value ?? ''}  />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    value={field.value?.toString()}
                                                    onValueChange={field.onChange}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Trạng thái ứng lương" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="0">Chờ duyệt</SelectItem>
                                                        <SelectItem value="1">Đã duyệt</SelectItem>
                                                        <SelectItem value="2">Từ chối</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Note</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter note" {...field} value={field.value ?? ''}  />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                                <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                                <Button type="submit" size='sm'>Save</Button>
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
