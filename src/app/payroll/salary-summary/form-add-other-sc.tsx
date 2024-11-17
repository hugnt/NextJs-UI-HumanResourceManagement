/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import {  useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Label } from "@/components/ui/label";

import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions, ColumnPassThroughOptions } from 'primereact/column';
import { PayrollResult, PayrollUpsert } from "@/data/schema/payroll.schema";
import { Input } from "@/components/ui/input";
import payrollApiRequest from "@/apis/payroll.api";
import { handleSuccessApi } from "@/lib/utils";
import LoadingSpinIcon from "@/components/loading-spin-icon";
type FormProps = {
    openForm: boolean,
    setOpenForm: (openForm: boolean) => void,
    period: string,
    employeeListSc?: PayrollResult[],
    toggleRefesh: () => void
}

//react query key
// const QUERY_KEY = {
//     keyDynamicColumn: 'dynamic-column'
// }

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
        className:`border text-xs whitespace-nowrap p-0 px-2 text-end` 
    }
}
export default function FormAddOtherSC(props: FormProps) {
    const { openForm, setOpenForm = () => { }, period = "2024/10",employeeListSc=[],toggleRefesh} = props;
    const [payrollOtherSCs, setPayrollOtherSCs] = useState<PayrollResult[]>([]);
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();

    // #region +TANSTACK QUERY
   
    const updateDataPayrollOtherSC = useMutation({
        mutationFn: (body: PayrollUpsert[]) => payrollApiRequest.updatePayrollOtherSC(body),
        onSuccess: () => {
            toggleRefesh();
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenForm(false);
        }
    });
    // #endregion

    // #region + FORM SETTINGS
    const handleUpdateForm = () => {
        const data: PayrollUpsert[] = payrollOtherSCs.map(x=>{
            return{
                id: x.id,
                otherBonus: x.otherBonus,
                otherDeduction: x.otherDeduction
            }
        })
        //console.log(data)
        updateDataPayrollOtherSC.mutate(data);
    };
    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenForm(false);
    };

    // #endregion
   
    useEffect(() => {
        setPayrollOtherSCs(employeeListSc)
    }, [employeeListSc]);


    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _payrollOtherSCs = [...payrollOtherSCs];
        const { newData, index } = e;

        const convertedData = newData as PayrollResult;
        _payrollOtherSCs[index] = convertedData
        _payrollOtherSCs[index].otherBonus = Number(convertedData.otherBonus);
        _payrollOtherSCs[index].otherDeduction = Number(convertedData.otherDeduction);
        setPayrollOtherSCs(_payrollOtherSCs);
    };
    const textEditor = (options: ColumnEditorOptions) => {
        return <Input type="text" 
                className="w-full py-[6px] px-2 text-end border-none h-full rounded-none focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.1rem_rgba(191,219,254,1)]" 
                value={options.value} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback!(e.target.value)} />;
    };

    return (
        <div>
            <AlertDialog open={openForm} onOpenChange={setOpenForm} >
                <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] 
                                sm:max-w-[600px] !sm:w-[600px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Thêm khoản phát sinh</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <div className="p-2 space-y-2">
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

                        <div className="">
                            <Label>Thêm khoản cho nhân viên</Label>
                            <DataTable value={payrollOtherSCs} showGridlines size="small" scrollable scrollHeight="400px" 
                                    editMode="row" dataKey="id" onRowEditComplete={onRowEditComplete}
                                        className="mt-2" pt={{
                                            table:{
                                                className:'border border-collapse'
                                            },
                                            root:{
                                                className:'h-[500px]'
                                            }
                                        }}>
                                <Column field="employeeName" header="Tên nhân viên" bodyStyle={{textAlign:'left'}} pt={pt}></Column>
                                <Column field="otherBonus" header="Tiền thưởng" editor={(options) => textEditor(options)} pt={pt} bodyStyle={{width: '120px',padding:'0 1px'}}></Column>
                                <Column field="otherDeduction" header="Tiền khấu trừ" editor={(options) => textEditor(options)} pt={pt} bodyStyle={{width: '120px',padding:'0 1px'}}></Column>
                                <Column rowEditor={true}  pt={pt} headerStyle={{ width: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
                                
                            </DataTable>
                        </div>



                    </div>
                    <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                        <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                        <Button type="button" disabled={updateDataPayrollOtherSC.isPending}  className="flex items-center" onClick={handleUpdateForm} size='sm'>
                            {updateDataPayrollOtherSC.isPending&&<LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white "/>}
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
