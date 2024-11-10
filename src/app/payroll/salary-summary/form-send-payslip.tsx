/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Tree, TreeCheckboxSelectionKeys, TreeContext, TreeMultipleSelectionKeys, TreeProps, TreeSelectionEvent } from 'primereact/tree';
import payrollApiRequest from "@/apis/payroll.api";
import { classNames } from "primereact/utils";
import { Label } from "@/components/ui/label";
import { PayrollListUpsert } from "@/data/schema/payroll.schema";
import { handleSuccessApi } from "@/lib/utils";
import LoadingSpinIcon from "@/components/loading-spin-icon";

type FormProps = {
    openAE: boolean,
    setOpenAE: (openAE: boolean) => void,
    period: string
}

//react query key
const QUERY_KEY = {
    keyList: "payroll-list",
    keyUpdate: "update-employee-payroll",
    keyCompanyTree: "company-tree"
}

export default function FormPayslip(props: FormProps) {
    const { openAE, setOpenAE = () => { }, period = "2024/10" } = props;
    const [selectedKeys, setSelectedKeys] = useState<string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null>(null);
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();
    // #region +TANSTACK QUERY

    // Get QueryClient from the context
    const listDataCompanyTree = useQuery({
        queryKey: [QUERY_KEY.keyCompanyTree],
        queryFn: () => payrollApiRequest.getCompanyTree()
    });

    const updateDataPayrollList = useMutation({
        mutationFn: (body: PayrollListUpsert) => payrollApiRequest.updatePayrollList(body),
        onSuccess: () => {
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenAE(false);
        }
    });
    const listNode = listDataCompanyTree.data?.metadata ?? [];

    // #endregion

    // #region + FORM SETTINGS
    const handleUpdateForm = () => {
        const employeeIds = [];
        for (const key in selectedKeys as TreeMultipleSelectionKeys) {
            if (key.split('-').length === 3) {
                const lastPart = key.split('-').pop();
                employeeIds.push(Number(lastPart));
            }
        }
        console.log("period:", period)
        console.log("employeeIds:", employeeIds);
        const yearMonth = period.split("/");
        const data: PayrollListUpsert = {
            period: {
                month: Number(yearMonth[1]),
                year: Number(yearMonth[0])
            },
            employeeIds: employeeIds
        }
        console.log(data)
        updateDataPayrollList.mutate(data);
        
    };
    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenAE(false);
    };
    // #endregion

    return (
        <div>
            <AlertDialog open={openAE} onOpenChange={setOpenAE} >
                <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] 
                                sm:max-w-[600px] !sm:w-[600px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Chọn nhân viên gửi phiếu lương</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <div className="text-sm p-2 space-y-3">
                        <div>
                            <Label>Kì lương</Label>
                            <Select value={period}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Chọn kì lương" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        Array.from({ length: currentMonth }, (v, i) => {
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

                        <div>
                            <Label>Chọn nhân viên</Label>
                            <div className="mt-2 border border-gray-400 rounded-sm h-[60vh]  overflow-y-auto">
                                <Tree value={listNode}
                                    selectionMode="checkbox"
                                    filter filterMode="strict" filterPlaceholder="Tìm kiếm nhân viên"
                                    loading={false}
                                    onSelectionChange={(e:TreeSelectionEvent) => setSelectedKeys(e.value)}
                                    className="w-full p-0"
                                    pt={{
                                        label: {
                                            className: 'text-sm font-sans'
                                        },
                                        content: ({ context, props }: { context: TreeContext; props: TreeProps }) => ({
                                            className: classNames(
                                                'm-0 p-0 flex items-center',
                                                'rounded-lg transition-shadow duration-200',
                                                'focus:outline-none focus:outline-offset-0',
                                                { 'bg-neutral-100 text-neutral-800': context.checked }
                                            )
                                        }),
                                        nodeCheckbox: {
                                            className: 'w-4 h-4 rounded border border-gray-300 flex items-center justify-center overflow-hidden'
                                        },
                                        subgroup: {
                                            className: classNames('m-0 list-none', 'p-0 pl-4')
                                        },
                                        filterContainer: {
                                            className: 'p-2 border-b'
                                        },
                                        input: {
                                            className: 'text-sm p-2 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.1rem_rgba(191,219,254,1)] '
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                        <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                        <Button type="button" disabled={updateDataPayrollList.isPending}  className="flex items-center" size='sm'>
                            {updateDataPayrollList.isPending&&<LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white "/>}
                            Send
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
