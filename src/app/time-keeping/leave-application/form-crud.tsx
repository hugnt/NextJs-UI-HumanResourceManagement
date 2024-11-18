import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const";
import { leaveApplicationSchema, StatusLeave, leaveApplicationDefault, leaveApplication } from "@/data/schema/leaveApplication.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { AlertDialogDescription } from "@/components/ui/alert-dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import leaveApplicationApiRequest from "@/apis/leaveApplication.api";
import { handleErrorApi, handleSuccessApi } from "@/lib/utils";

type FormProps = {
    openCRUD: boolean,
    mode: CRUD_MODE,
    setOpenCRUD: (openCRUD: boolean) => void,
    size?: number,
    detail: leaveApplication
}

const QUERY_KEY = {
    keyList: "leave-application",
    keySub: "employee"
}

export default function FormCRUD(props: FormProps) {
    const { openCRUD, setOpenCRUD, size = 600, mode, detail } = props;
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const addDataMutation = useMutation({
        mutationFn: (body: leaveApplication) => leaveApplicationApiRequest.create(body),
        onSuccess: (data) => {
            if (data.isSuccess) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
                handleSuccessApi({ message: "Inserted Successfully!" });
                setOpenCRUD(false);
            } else {
                handleErrorApi({ error: data.message });
            }
        }
    });

    const updateDataMutation = useMutation({
        mutationFn: ({ id, body }: { id: number, body: leaveApplication }) => leaveApplicationApiRequest.update(id, body),
        onSuccess: (data) => {
            if (data.isSuccess) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
                handleSuccessApi({ message: "Updated Successfully!" });
                setOpenCRUD(false);
            } else {
                handleErrorApi({ error: data.message });
            }
        }
    });

    const deleteDataMutation = useMutation({
        mutationFn: (id: number) => leaveApplicationApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
            handleSuccessApi({ message: "Deleted Successfully!" });
            setOpenCRUD(false);
        }
    });

    const {data: listDataEmployeeQuery} = useQuery({
        queryKey: [QUERY_KEY.keySub],
        queryFn: () => leaveApplicationApiRequest.getAllEmployee(),
        staleTime: 5000
    });

    

    const form = useForm<leaveApplication>({
        resolver: zodResolver(leaveApplicationSchema),
        defaultValues: mode === CRUD_MODE.ADD ? {
            ...leaveApplicationDefault,
            statusLeave: StatusLeave.Draft
        } : leaveApplicationDefault,
    });
    const onSubmit = (data: leaveApplication) => {
        // Chuyển đổi giá trị statusLeave từ chuỗi thành enum
        //data.statusLeave = parseInt(data.statusLeave);
    
        if (mode === CRUD_MODE.ADD) {
            addDataMutation.mutate(data);
        } else if (mode === CRUD_MODE.EDIT) {
            updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
        } else if (mode === CRUD_MODE.DELETE) {
            deleteDataMutation.mutate(data.id ?? 0);
        }
    }

    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenCRUD(false);
    };

    useEffect(() => {
        if (Object.keys(detail).length > 0) {
            form.reset(detail);
        }
        setIsDisabled(mode === CRUD_MODE.VIEW);
    }, [detail, mode, openCRUD]);

    return (
        <div>
            <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD}>
                {mode !== CRUD_MODE.DELETE ? (
                    <AlertDialogContent className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
                        <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                            <AlertDialogTitle className="text-slate-50">{mode === CRUD_MODE.ADD ? "Thêm yêu cầu nghỉ phép" : "Sửa yêu cầu nghỉ phép"}</AlertDialogTitle>
                        </AlertDialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                                <div className="p-2 text-sm space-y-3">
                                <FormField control={form.control} name="employeeId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nhân viên</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    value={field.value?.toString()}
                                                    onValueChange={field.onChange}
                                                    disabled={isDisabled}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Chọn nhân viên" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {listDataEmployeeQuery!.metadata?.map((item) => (
                                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                                {item.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />  

                                    <FormField control={form.control} name="timeLeave"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Thời gian nghỉ</FormLabel>
                                                <FormControl>
                                                    <Input type="number" placeholder="Nhập thời gian nghỉ" {...field} disabled={isDisabled} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField control={form.control} name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập mô tả"
                                                        {...field}
                                                        value={field.value ?? ''}
                                                        disabled={isDisabled}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField control={form.control} name="statusLeave"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trạng thái</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        {...field}
                                                        value={field.value?.toString() ?? "1"}
                                                        onValueChange={(value) => {
                                                            const enumValue = parseInt(value);
                                                            field.onChange(enumValue);
                                                        }}
                                                        disabled={isDisabled}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value={StatusLeave.Draft.toString()}>Draft</SelectItem>
                                                            <SelectItem value={StatusLeave.Approved.toString()}>Approved</SelectItem>
                                                            <SelectItem value={StatusLeave.Refuse.toString()}>Refuse</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                                    <Button onClick={handleCloseForm} className="bg-gray-400 hover:bg-red-500" size='sm'>Đóng</Button>
                                    {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                                        <Button type="submit" size='sm'>Lưu</Button>}
                                </AlertDialogFooter>
                            </form>
                        </Form>
                    </AlertDialogContent>
                ) : (
                    <AlertDialogContent className={`gap-0 top-[50%] border-none overflow-hidden p-0 w-[400px] sm:rounded-[0.3rem]`}>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogDescription className="text-center pb-4 text-lg text-stone-700">
                            Bạn có chắc chắn muốn xóa yêu cầu này không?
                        </AlertDialogDescription>
                        <AlertDialogFooter className="!justify-center p-2 py-3 text-center">
                            <Button onClick={handleCloseForm} className="bg-gray-400 hover:bg-red-500" size='sm'>Đóng</Button>
                            <Button className="" size='sm' onClick={() => onSubmit(detail)}>Xác nhận</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                )}
            </AlertDialog>
        </div>
    );
}