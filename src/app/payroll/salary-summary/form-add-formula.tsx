/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import "primereact/resources/themes/lara-light-cyan/theme.css";
import { Label } from "@/components/ui/label";

import { DataTable, DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { Column, ColumnEditorOptions } from 'primereact/column';
import { PayrollFormula, PayrollResult, PayrollUpsert } from "@/data/schema/payroll.schema";
import formulaApiRequest from "@/apis/formula.api";
import { Formula } from "@/data/schema/formula.schema";
import { IconRefresh } from "@tabler/icons-react";
import { handleSuccessApi } from "@/lib/utils";
import payrollApiRequest from "@/apis/payroll.api";
import LoadingSpinIcon from "@/components/loading-spin-icon";
type FormProps = {
    openForm: boolean,
    setOpenForm: (openForm: boolean) => void,
    period: string,
    employeeListSc?: PayrollResult[],
    toggleRefesh: () => void
}

//react query key
const QUERY_KEY = {
    formulaList: 'formula-list'
}


const pt = {
    columnTitle: {
        className: 'text-sm'
    },
    headerTitle: {
        className: 'text-xs text-center'
    },
    headerCell: {
        className: `whitespace-nowrap border `
    },
    bodyCell: {
        className: `border text-xs whitespace-nowrap py-[1px] px-2`
    }
}
export default function FormAddFormula(props: FormProps) {
    const { openForm, setOpenForm = () => { }, period = "2024/10", employeeListSc = [],toggleRefesh } = props;
    const [payrollFormulas, setPayrollFormulas] = useState<PayrollFormula[]>([]);
    const [formulaList, setFormulaList] = useState<Formula[]>([]);
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();
    const [refesh, setRefesh] = useState<boolean>(false);
    // #region +TANSTACK QUERY

    const listDataFormulaList = useQuery({
        queryKey: [QUERY_KEY.formulaList],
        queryFn: () => formulaApiRequest.getList()
    });

    const updateDataPayrollFormula = useMutation({
        mutationFn: (body: PayrollUpsert[]) => payrollApiRequest.updatePayrollFormula(body),
        onSuccess: () => {
            toggleRefesh();
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenForm(false);
        }
    });

    // #endregion

    // #region + FORM SETTINGS
    const handleUpdateForm = () => {
        const data: PayrollUpsert[] = payrollFormulas.map(x=>{
            return{
                id: x.payrollId,
                fomulaId: x.formulaId
            }
        })
        console.log(data)
        updateDataPayrollFormula.mutate(data);
    };
    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenForm(false);
    };

    // #endregion

    useEffect(() => {
        var allFormula = listDataFormulaList.data?.metadata ?? [];
        const lstPayrollFormula: PayrollFormula[] = employeeListSc.map(x => {
            return {
                payrollId: x.id,
                employeeName: x.employeeName,
                formulaId: x.fomulaId
            }

        })
        setFormulaList(allFormula)
        setPayrollFormulas(lstPayrollFormula)
    }, [period, refesh,openForm]);


    const onRowEditComplete = (e: DataTableRowEditCompleteEvent) => {
        let _payrollFormulas = [...payrollFormulas];
        const { newData, index } = e;

        const convertedData = newData as PayrollFormula;
        _payrollFormulas[index] = convertedData
        _payrollFormulas[index].formulaId = Number(convertedData.formulaId)
        setPayrollFormulas(_payrollFormulas);
    };
    const selectEditor = (options: ColumnEditorOptions) => {
        return (
            <Select
                value={options.value.toString()}
                onValueChange={(e) => options.editorCallback!(e)}>
                <SelectTrigger className="w-full py-[6px] px-2  border-none h-full rounded-none focus:outline-none focus:outline-offset-0 focus:shadow-none">
                    <SelectValue className="text-sm" placeholder="Trạng thái ứng lương" />
                </SelectTrigger>
                <SelectContent>
                    {
                        formulaList.map((x, i) => {
                            return (<SelectItem key={i} value={x.id?.toString() ?? "0"}>{x.name}</SelectItem>)
                        })
                    }
                </SelectContent>
            </Select>
        )
    };
    const selectNameTemplate = (rowData: PayrollFormula) => {
        return formulaList.find(x => x.id == rowData.formulaId)?.name;
    };

    const selectDescTemplate = (rowData: PayrollFormula) => {
        return formulaList.find(x => x.id == rowData.formulaId)?.note;
    };

    return (
        <div>
            <AlertDialog open={openForm} onOpenChange={setOpenForm} >
                <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] 
                                sm:max-w-[1000px] !sm:w-[1000px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Cập nhật công thức</AlertDialogTitle>
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

                        <div className="">
                            <div className="flex justify-between items-center">
                                <Label>Cập nhật công thức tính lương </Label>
                                <Button variant='outline' size='sm'
                                    onClick={() => setRefesh(!refesh)}
                                    className='bg-green-500 ml-auto hidden h-7 lg:flex text-white hover:bg-blue-500 hover:text-white'>
                                    <IconRefresh className='h-5 w-5' />
                                </Button>
                            </div>

                            <DataTable value={payrollFormulas} resizableColumns showGridlines size="small" scrollable scrollHeight="400px"
                                editMode="row" dataKey="payrollId" onRowEditComplete={onRowEditComplete}
                                className="mt-2" pt={{
                                    table: {
                                        className: 'border border-collapse'
                                    },
                                    root: {
                                        className: 'h-[300px]'
                                    }
                                }}>
                                <Column frozen field="employeeName" header="Tên nhân viên" bodyStyle={{ textAlign: 'left' }} pt={pt}></Column>
                                <Column field="formulaId" header="Công thức tính lương" body={selectNameTemplate} editor={(options) => selectEditor(options)} pt={pt} bodyStyle={{ width: '300px' }}></Column>
                                <Column field="formulaDesc" header="Mô tả công thức" body={selectDescTemplate} pt={pt} bodyStyle={{ width: '600px' }}></Column>
                                <Column rowEditor={true} pt={pt} headerStyle={{ width: '200px' }} bodyStyle={{ textAlign: 'center' }}></Column>

                            </DataTable>
                        </div>



                    </div>
                    <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                        <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                        <Button type="button" disabled={updateDataPayrollFormula.isPending}  className="flex items-center" onClick={handleUpdateForm} size='sm'>
                            {updateDataPayrollFormula.isPending&&<LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white "/>}
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
