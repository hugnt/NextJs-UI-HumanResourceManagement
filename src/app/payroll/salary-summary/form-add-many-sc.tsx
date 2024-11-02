/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { SVGProps, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import "primereact/resources/themes/lara-light-cyan/theme.css";
import payrollApiRequest from "@/apis/payroll.api";
import { Label } from "@/components/ui/label";

import { DataTable, DataTableExpandedRows } from 'primereact/datatable';
import { Column, ColumnBodyOptions } from 'primereact/column';
import { ColumnMeta, DynamicTableObject, PayrollResult, PayrollSC, PayrollUpsert } from "@/data/schema/payroll.schema";
import { Checkbox } from "@/components/ui/checkbox";
import { IconRefresh } from "@tabler/icons-react";
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
const QUERY_KEY = {
    keyDynamicColumn: 'dynamic-column'
}

// có 
// var obj = [
//     {
//         employeeId:1,
//         employeeName:"ABC",
//         bonusIds:[1,2,3,4]
//     },
//     {
//         employeeId:2,
//         employeeName:"eiofBC",
//         bonusIds:[7,4,3]
//     },
// ]
// và
// var lstAllIds = ['1','2','3','4','5','6','7']
// từ obj và lstAllIds hãy trả về 1 list object có key là employeeName và các trường là các phần tử trong lstAllIds
// nếu trong obj.bonusIds có chứa 1 số trùng với 1 só trong lstAllIds thì giá trị nó là true
// var target = [
//     {
//         employeeId:1,
//         employeeName:"ABC",
//         '1': true,
//         '2': true,
//         '3': true,
//         '4': true,
//         '5': false,
//         '6': false,
//         '7': false
//     },
//     {
//         employeeId:2,
//         employeeName:"eiofBC",
//         '1': false,
//         '2': false,
//         '3': true,
//         '4': true,
//         '5': false,
//         '6': false,
//         '7': true
//     },
// ]


const CheckTemplate: React.FC<{
    rowData: DynamicTableObject;
    options: ColumnBodyOptions;
    listPayrollSC: PayrollSC[];
    setListPayrollSC: (listPayrollSC: PayrollSC[]) => void
}> = ({ rowData, options, listPayrollSC, setListPayrollSC }) => {
    const [check, setCheck] = useState<boolean>(false);
    const [scId, setSCId] = useState<number>(Number(options.field));
    // Khởi tạo giá trị từ rowData
    useEffect(() => {
        setSCId(Number(options.field))
        const value = rowData[options.field] === true;
        setCheck(value)
    }, [rowData, options.field])
    const handleCheckedChange = (checked: boolean) => {
        const updatedListPayrollSC = listPayrollSC.map(payroll => {
            if (payroll.employeeId === rowData.employeeId) {
                const isAlreadyContrainsScId = payroll.listSCIds.includes(scId);

                const updatedListSCIds = checked ?
                    (isAlreadyContrainsScId ? payroll.listSCIds : [...payroll.listSCIds, scId])
                    : payroll.listSCIds.filter(id => id !== scId);

                return { ...payroll, listSCIds: updatedListSCIds };
            }
            return payroll;
        });

        setListPayrollSC(updatedListPayrollSC); // Cập nhật danh sách mới
        setCheck(checked); // Cập nhật trạng thái checkbox
    };
    return (
        <Checkbox checked={check} onCheckedChange={handleCheckedChange} />
    );
};

export default function FormAddManySC(props: FormProps) {
    const { openForm, setOpenForm = () => { }, period = "10/2024", employeeListSc = [],toggleRefesh} = props;
    const [scType, setSCType] = useState<number>(0);
    const [dynamicColumn, setDynamicColumn] = useState<ColumnMeta[]>([]);
    const [dynamicTableValue, setDynamicTableValue] = useState<DynamicTableObject[]>([]);
    const [listPayrollSC, setListPayrollSC] = useState<PayrollSC[]>([]);
    const [refesh, setRefesh] = useState<boolean>(false);
    const [fields, setFields] = useState<string[]>([]);


    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();
    // #region +TANSTACK QUERY

    const listDataDynamicColumn = useQuery({
        queryKey: [QUERY_KEY.keyDynamicColumn, scType],
        queryFn: () => payrollApiRequest.getDynamicColumn(scType)
    });

    const updateDataPayrollBonusSC = useMutation({
        mutationFn: (body: PayrollUpsert[]) => payrollApiRequest.updatePayrollBonusSC(body),
        onSuccess: () => {
            toggleRefesh();
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenForm(false);
        }
    });

    const updateDataPayrollDeductionSC = useMutation({
        mutationFn: (body: PayrollUpsert[]) => payrollApiRequest.updatePayrollDeductionSC(body),
        onSuccess: () => {
            toggleRefesh();
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenForm(false);
        }
    });
    // #endregion

    // #region + FORM SETTINGS
    const handleUpdateForm = () => {
        //console.log("RES: ", listPayrollSC);
        const data: PayrollUpsert[] = listPayrollSC.map(x=>{
            return{
                id: x.payrollId,
                listBonusIds: x.listSCIds,
                listDeductionIds: x.listSCIds
            }
        })
        console.log(data);
        if(scType==0) updateDataPayrollBonusSC.mutate(data);
        else if(scType==1) updateDataPayrollDeductionSC.mutate(data);
    };
    const handleCloseForm = (e: any) => {
        e.preventDefault();
        setOpenForm(false);
    };


    // #endregion


    useEffect(() => {
        const lstDataColumnQuery = listDataDynamicColumn.data?.metadata ?? [];
        const lstFieldNumber = lstDataColumnQuery.filter(x => x.field !== "employeeName").map(x => x.field);
        const payrollSC: PayrollSC[] = employeeListSc.map(x => {
            return {
                payrollId:x.id,
                employeeId: x.employeeId,
                employeeName: x.employeeName,
                departmentName: x.departmentName,
                listSCIds: scType == 0 ? x.listBonusIds : x.listDeductionIds
            }

        })
        //console.log("payrollSC", payrollSC)
        const dynamicValue: DynamicTableObject[] = payrollSC.map(sc => {
            const dynamicObj: DynamicTableObject = {
                employeeId: sc.employeeId,
                employeeName: sc.employeeName,
                departmentName: sc.departmentName
            };
            lstFieldNumber.forEach(id => {
                dynamicObj[id] = sc.listSCIds.includes(Number(id));
            });
            return dynamicObj;
        });

        console.log("dynamicValue: ", dynamicValue)
        setDynamicColumn(lstDataColumnQuery);
        setDynamicTableValue(dynamicValue);
        setFields(lstFieldNumber);
        setListPayrollSC(payrollSC);
    }, [refesh, scType,employeeListSc,listDataDynamicColumn.isSuccess]);

    return (
        <div>
            <AlertDialog open={openForm} onOpenChange={setOpenForm} >
                <AlertDialogContent
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] 
                                sm:max-w-[1000px] !sm:w-[1000px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Cập nhật các khoản cố định</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <div className="grid grid-cols-2 gap-2 gap-y-4 p-2">
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
                            <Label>Chọn loại khoản bổ sung</Label>
                            <Select value={scType.toString()} onValueChange={(e) => setSCType(Number(e))}>
                                <SelectTrigger className="mt-2">
                                    <SelectValue placeholder="Chọn khoản bổ sung" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Khoản thưởng</SelectItem>
                                    <SelectItem value="1">Khoản khấu trừ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="col-span-2">
                            <div className="flex justify-between items-center">
                                <Label>Thêm khoản cho nhân viên</Label>
                                <Button variant='outline' size='sm'
                                    onClick={() => setRefesh(!refesh)}
                                    className='bg-green-500 ml-auto hidden h-7 lg:flex text-white hover:bg-blue-500 hover:text-white'>
                                    <IconRefresh className='h-5 w-5' />
                                </Button>
                            </div>
                            <DataTable loading={listDataDynamicColumn.isPending}
                                value={dynamicTableValue} showGridlines size="small"
                                scrollable scrollHeight="400px" dataKey="employeeId"
                                className="mt-2" pt={{
                                    table: {
                                        className: 'border border-collapse'
                                    },
                                    root: {
                                        className: 'h-[500px]'
                                    },
                                    loadingOverlay: {
                                        className: 'bg-white'
                                    },
                                    loadingIcon: {
                                        className: 'w-8 h-8 text-blue-500'
                                    }
                                }}>
                                {dynamicColumn.map((col, i) => {
                                    const isFrozen = i == 0;
                                    const widthHeader = i == 0 ? 'whitespace-nowrap' : 'min-w-[150px]'
                                    const cellStyle = i == 0 ? '' : 'text-center';
                                    return <Column
                                        body={i != 0 && ((rowData: DynamicTableObject, options: ColumnBodyOptions) =>
                                            <CheckTemplate listPayrollSC={listPayrollSC}
                                                setListPayrollSC={setListPayrollSC}
                                                rowData={rowData} options={options} />)}
                                        frozen={isFrozen} key={col.field} field={col.field} header={col.header} pt={{
                                            columnTitle: {
                                                className: 'text-sm'
                                            },
                                            headerTitle: {
                                                className: 'text-xs'
                                            },
                                            headerCell: {
                                                className: `${widthHeader} border`
                                            },
                                            bodyCell: {
                                                className: `border text-xs whitespace-nowrap p-2 ${cellStyle}`
                                            }
                                        }} />
                                })}
                            </DataTable>
                        </div>



                    </div>
                    <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                        <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                        <Button type="button" disabled={updateDataPayrollBonusSC.isPending||updateDataPayrollDeductionSC.isPending}  className="flex items-center" onClick={handleUpdateForm} size='sm'>
                            {(updateDataPayrollBonusSC.isPending||updateDataPayrollDeductionSC.isPending)&&<LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white "/>}
                            Save
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
