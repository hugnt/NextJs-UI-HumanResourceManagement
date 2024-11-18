/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import payrollApiRequest from "@/apis/payroll.api";
import { Label } from "@/components/ui/label";
import { formatDateToYYYYMMDD, handleSuccessApi } from "@/lib/utils";
import LoadingSpinIcon from "@/components/loading-spin-icon";
import { PayrollFilter, PayrollResult } from "@/data/schema/payroll.schema";
import { DataTable } from 'primereact/datatable';
import { Column, ColumnPassThroughOptions } from 'primereact/column';
import { CheckboxPassThroughOptions } from "primereact/checkbox";
import { DateRange } from "react-day-picker";

type FormProps = {
    openAE: boolean,
    setOpenAE: (openAE: boolean) => void,
    period: string,
    dateRange?: DateRange,
    employeeListSc: PayrollResult[]
}

//react query key
const rowCheckbox:CheckboxPassThroughOptions={
    box:{
        className:'w-5 h-5 mx-auto border border-gray-300'
    }
}
const pt:ColumnPassThroughOptions = {
    columnTitle:{
        className:'text-sm'
    },
    headerTitle:{
        className:'text-xs text-center'
    },
    headerCell:{
        className:`whitespace-nowrap border `
    },
    bodyCell:{
        className:`border text-sm whitespace-nowrap p-1 px-2` 
    },
    rowCheckbox:rowCheckbox,
    headerCheckbox: rowCheckbox
}
export default function FormPayslip(props: FormProps) {
    const { openAE, setOpenAE = () => { }, employeeListSc = [], period = "2024/10", dateRange } = props;
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();
    const [selectedEmployees, setSelectedEmployees] = useState<PayrollResult[]>([]);
    // #region +TANSTACK QUERY

    const sendPayslipData = useMutation({
        mutationFn: ({ period, body }: { period: string, body: PayrollFilter }) => payrollApiRequest.sendPayslip(period, body),
        onSuccess: () => {
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenAE(false);
        }
    });
    // #endregion

    // #region + FORM SETTINGS
    const handleUpdateForm = () => {
        const employeeIds: number[] = selectedEmployees.map(x=>x.employeeId)??[];
        const filter: PayrollFilter = {
            dfrom: formatDateToYYYYMMDD(dateRange?.from),
            dto: formatDateToYYYYMMDD(dateRange?.to),
            employeeIds: employeeIds
          }
        console.log("period:", period)
        console.log("employeeIds:", employeeIds);
        sendPayslipData.mutate({ period, body: filter });

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
                                        Array.from({ length: currentMonth }, (_v, i) => {
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
                                <DataTable value={employeeListSc}
                                            size="small" 
                                            selectionMode={'checkbox'}
                                            selection={selectedEmployees}
                                            onSelectionChange={(e) => setSelectedEmployees(e.value)}
                                            scrollable scrollHeight="400px"
                                            dataKey="id" pt={{
                                                table:{
                                                    className:'border border-collapse'
                                                },
                                            }}>
                                    <Column  pt={pt}  selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                    <Column  pt={pt} field="employeeName" header="Tên nhân viên"></Column>
                                    <Column  pt={pt} field="departmentName" header="Phòng ban"></Column>
                                </DataTable>
                            </div>
                        </div>
                    </div>
                    <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                        <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                        <Button type="button" disabled={sendPayslipData.isPending} onClick={handleUpdateForm} className="flex items-center" size='sm'>
                            {sendPayslipData.isPending && <LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white " />}
                            Send
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
