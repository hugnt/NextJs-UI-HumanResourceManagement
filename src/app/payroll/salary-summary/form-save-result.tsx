/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import "primereact/resources/themes/lara-light-cyan/theme.css";
import payrollApiRequest from "@/apis/payroll.api";
import { Label } from "@/components/ui/label";
import { handleSuccessApi } from "@/lib/utils";
import LoadingSpinIcon from "@/components/loading-spin-icon";
import { ColumnMeta, ColumnTableHeader, PayrollDataTable, PayrollHistory } from "@/data/schema/payroll.schema";
import { Input } from "@/components/ui/input";

type FormProps = {
    openSaveRS: boolean,
    setOpenSaveRS: (openSaveRS: boolean) => void,
    period: string,
    payrollHeader?: ColumnTableHeader[][],
    payrollColumn?: ColumnMeta[],
    payrollData?: PayrollDataTable[],
    displayColumns?: ColumnMeta[],
}

const currentMonth: number = new Date().getMonth() + 1;
const currenYear: number = new Date().getFullYear();
export default function FormSaveResult(props: FormProps) {
    const { openSaveRS, setOpenSaveRS = () => { }, period = "2024/10", payrollHeader, payrollColumn, payrollData, displayColumns } = props;
    const [recordName, setRecordName] = useState<string>("");
    const [note, setNote] = useState<string>("");

    // #region +TANSTACK QUERY
    const saveHistoryMutation = useMutation({
        mutationFn: (body: PayrollHistory) => payrollApiRequest.saveHistory(body),
        onSuccess: () => {
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenSaveRS(false);
        }
    });
    // #endregion

    // #region + FORM SETTINGS
    const handleUpdateForm = () => {
        const payPeriod = period.split("/");
        const history: PayrollHistory = {
            name: recordName,
            note: note,
            month: Number(payPeriod[1]),
            year: Number(payPeriod[0]),
            createdAt: new Date(),
            payrollHeader: payrollHeader,
            payrollColumn: payrollColumn,
            payrollData: payrollData,
            displayColumns: displayColumns
        }
        saveHistoryMutation.mutate(history);

    };

    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenSaveRS(false);
    };

    useEffect(() => {
        const payPeriod = period.split("/");
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0'); // 24-hour format
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const defaultName =`${hours}:${minutes} - `+ "BẢNG LƯƠNG TỔNG HỢP " + payPeriod[1] + "/" + payPeriod[0];
        setRecordName(defaultName);
    },[openSaveRS==true])
    // #endregion

    return (
        <div>
            <AlertDialog open={openSaveRS} onOpenChange={setOpenSaveRS} >
                <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] 
                                sm:max-w-[600px] !sm:w-[600px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Lưu lại kết quả tổng hợp</AlertDialogTitle>
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
                            <Label>Tên bảng lương (*)</Label>
                            <Input value={recordName} onChange={(e) => setRecordName(e.target.value)} className="mt-2" placeholder="Nhập tên bảng lương cần lưu" />
                        </div>

                        <div>
                            <Label>Ghi chú</Label>
                            <Input value={note} onChange={(e) => setNote(e.target.value)} className="mt-2" placeholder="Nhập tên bảng lương cần lưu" />
                        </div>
                    </div>
                    <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                        <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                        <Button type="button" disabled={saveHistoryMutation.isPending} onClick={handleUpdateForm} className="flex items-center" size='sm'>
                            {saveHistoryMutation.isPending && <LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white " />}
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
