import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Department, departmentDefault, departmentSchema } from "@/data/schema/department.schema";
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
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import departmentApiRequest from "@/apis/department.api";
import { handleErrorApi, handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
type FormProps = {
    openCRUD: boolean,
    mode: CRUD_MODE,
    setOpenCRUD: (openCRUD: boolean) => void,
    size?: number,
    detail: Department
}

//react query key
const QUERY_KEY = {
    keyList: "department",
    keySub: "employee"
}

export default function FormCRUD(props: FormProps) {
    const { openCRUD = false, setOpenCRUD = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = {} } = props;
    const [isDisabled, setIsDisabled] = useState<boolean>(false);

    // #region +TANSTACK QUERY
    const queryClient = useQueryClient();
    const addDataMutation = useMutation({
        mutationFn: (body: Department) => departmentApiRequest.create(body),
        onSuccess: (data) => {
            if (data.isSuccess) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
                handleSuccessApi({ message: "Inserted Successfully!" });
                setOpenCRUD(false);
            } else {
                handleErrorApi({ error: data.message })
            }
        }
    });

    const updateDataMutation = useMutation({
        mutationFn: ({ id, body }: { id: number, body: Department }) => departmentApiRequest.update(id, body),
        onSuccess: (data) => {
            if (data.isSuccess) {
                queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
                handleSuccessApi({ message: "Updated Successfully!" });
                setOpenCRUD(false);
            }
            else {
                handleErrorApi({ error: data.message })
            }
        }
    });

    const deleteDataMutation = useMutation({
        mutationFn: (id: number) => departmentApiRequest.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
            handleSuccessApi({ message: "Deleted Successfully!" });
            setOpenCRUD(false);
        }
    });

    const listDataEmployeeQuery = useQuery({
        queryKey: [QUERY_KEY.keySub, detail.id],
        queryFn: () => departmentApiRequest.getAllEmployeeInDepartment(detail.id ?? 0)
    });
    // #endregion

    // #region + FORM SETTINGS
    const form = useForm<Department>({
        resolver: zodResolver(departmentSchema),
        defaultValues: departmentDefault,
    });

    const onSubmit = (data: Department) => {
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
        if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
        else setIsDisabled(false);
    }, [detail, mode, openCRUD])

    return (
        <div>
            <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
                {mode != CRUD_MODE.DELETE ? <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Thêm phòng ban</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                            <div className="p-2 text-sm space-y-3">
                                <FormField control={form.control} name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tên phòng ban</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập tên phòng ban" {...field} disabled={isDisabled} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="managerId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Quản lí phòng ban</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    value={field.value?.toString()} // Giá trị của Select được quản lý bởi react-hook-form
                                                    onValueChange={field.onChange} // Chuyển giá trị về react-hook-form khi người dùng chọn
                                                    disabled={isDisabled}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Chọn nhân viên làm quản lí" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {
                                                            listDataEmployeeQuery.data?.metadata?.map((item, index) => {
                                                                return <SelectItem key={index} value={item.id.toString()}>
                                                                    <div>
                                                                        <p>{item.name}</p>
                                                                        <span className="text-[10px] font-bold italic">{item.email}</span>
                                                                    </div>
                                                                </SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

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
