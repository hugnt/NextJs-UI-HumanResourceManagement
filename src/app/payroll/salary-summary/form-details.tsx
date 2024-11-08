import bonusApiRequest from "@/apis/bonus.api";
import deductionApiRequest from "@/apis/deduction.api";
import payrollApiRequest from "@/apis/payroll.api";
import { Button } from "@/components/custom/button";
import LoadingSpinIcon from "@/components/loading-spin-icon";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PayrollResult, PayrollUpsert } from "@/data/schema/payroll.schema";
import { formatCurrency, handleSuccessApi } from "@/lib/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaSave } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

type FormProps = {
    openForm: boolean,
    setOpenForm: (openForm: boolean) => void,
    period: string,
    toggleRefesh: () => void,
    payroll?: PayrollResult
}

//react query key
const QUERY_KEY = {
    keyListBonus: "payrol-details-bonus-list",
    keyListDeduction: "payrol-details-deduction-list",
}

export default function FormDetails(props: FormProps) {
    const { openForm, setOpenForm = () => { }, period = "10/2024", payroll, toggleRefesh } = props;
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();

    const [listBonusIds, setListBonusIds] = useState<number[]>([]);
    const [listDeductionIds, setListDeductionIds] = useState<number[]>([]);

    // #region +TANSTACK QUERY
    const listDataBonus = useQuery({
        queryKey: [QUERY_KEY.keyListBonus],
        queryFn: () => {
            return bonusApiRequest.getList()
        },
    });

    const listDataDeduction = useQuery({
        queryKey: [QUERY_KEY.keyListDeduction],
        queryFn: () => {
            return deductionApiRequest.getList()
        },
    });

    const updateDataPayrollDetails = useMutation({
        mutationFn: (body: PayrollUpsert) => payrollApiRequest.updatePayrollDetails(body),
        onSuccess: () => {
            toggleRefesh();
            handleSuccessApi({ message: "Updated Successfully!" });
            setOpenForm(false);
        }
    });

    // #endregion

    const handleChangeBonus = (checked: boolean, id?: number) =>{
        if(!id) return;
        const isExistInList = listBonusIds.includes(id);
        const updatedListSCIds = checked ?
                (isExistInList ? listBonusIds : [...listBonusIds, id])
                : listBonusIds.filter(x => x !== id);
        setListBonusIds(updatedListSCIds);
    }

    const handleChangeDeduction = (checked: boolean, id?: number) =>{
        if(!id) return;
        const isExistInList = listDeductionIds.includes(id);
        const updatedListSCIds = checked ?
                (isExistInList ? listDeductionIds : [...listDeductionIds, id])
                : listDeductionIds.filter(x => x !== id);
        setListDeductionIds(updatedListSCIds);
    }

    // FORM SETTINGS
    const handleUpdateForm = () => {
        const data: PayrollUpsert =  {
            id: payroll?.id,
            listBonusIds: listBonusIds,
            listDeductionIds: listDeductionIds,
            employeeId: payroll?.employeeId,

        }
        //console.log(data);
        updateDataPayrollDetails.mutate(data);
    };

    useEffect(()=>{
        const lstBonusIds = payroll?.listBonusIds??[];
        const lstDeductionIds = payroll?.listDeductionIds??[];
        //console.log("lstBonusIds: ",lstBonusIds)
        setListBonusIds(lstBonusIds);
        setListDeductionIds(lstDeductionIds);
    },[payroll])

    return (
        <div>
            <Sheet open={openForm} onOpenChange={setOpenForm}>
                <SheetContent className="p-0 overflow-y-auto sm:max-w-[800px] !sm:w-[800px] min-w-[800px]">
                    <SheetHeader className="px-4 pt-3">
                        <SheetTitle>Chi tiết lương</SheetTitle>
                        <SheetDescription>
                            Hiển thị chi tiết thông tin về các khoản lương, thành phần lương của nhân viên được trong tháng
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid grid-cols-2 gap-2 py-2 p-4">
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Label>Kì lương</Label>
                                <Select value={period}>
                                    <SelectTrigger >
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
                            <div className="col-span-2">
                                <Label>Tên nhân viên</Label>
                                <Input value={payroll?.employeeName} readOnly placeholder="Name of employee" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <Label>Phòng ban</Label>
                                <Input value={payroll?.departmentName} readOnly placeholder="Tên phòng ban" />
                            </div>
                            <div>
                                <Label>Vị trí</Label>
                                <Input value={payroll?.positionName} readOnly placeholder="Tên vị trí" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="col-span-2">
                                <Label>Lương cơ bản</Label>
                                <Input value={payroll?.contractSalary.baseSalary} readOnly placeholder="Lương cơ bản" />
                            </div>
                            <div>
                                <Label>Hệ số (0-1)</Label>
                                <Input value={payroll?.contractSalary.factor} readOnly placeholder="Hệ số" />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <Label>Số giờ QĐ</Label>
                                <Input value={payroll?.contractSalary.requiredHours} readOnly placeholder="Số giờ QĐ" />
                            </div>
                            <div className="col-span-2">
                                <Label>Giờ công (VNĐ)</Label>
                                <Input value={payroll?.contractSalary.wageHourly} readOnly placeholder="Giờ công" />
                            </div>
                        </div>
                        <div className="col-span-2 grid grid-cols-6 gap-2">
                            <div className="col-span-3"></div>
                            <div>
                                <Label>Số ngày QĐ</Label>
                                <Input value={payroll?.contractSalary.requiredDays} readOnly placeholder="Số giờ QĐ" />
                            </div>
                            <div className="col-span-2">
                                <Label>Ngày công (VNĐ)</Label>
                                <Input value={payroll?.contractSalary.wageDaily} readOnly placeholder="Giờ công" />
                            </div>
                        </div>
                        <div className="col-span-2 grid grid-cols-6 gap-2 ">
                            <div className="col-span-2">
                                <Label>Lương đóng bảo hiểm</Label>
                                <Input value={payroll?.contractSalary.baseInsurance} readOnly placeholder="Lương cơ bản" />
                            </div>
                            <div className="col-span-4">
                                <Label>Danh sách bảo hiểm</Label>
                                <Input readOnly value={payroll?.listInsurance.map(x => x.name).join(",")} />
                            </div>

                        </div>
                        <div>
                            <Label>Danh sách phụ cấp</Label>
                            <div className="overflow-y-auto h-[200px]">
                                <Table className="border">
                                    <TableHeader className="sticky z-10 top-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableHead>Tên khoản</TableHead>
                                            <TableHead className="text-right">Số tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            payroll?.listAllowance.map((x, i) => {
                                                return <TableRow key={i}>
                                                    <TableCell>{x.name}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(x.amount)}</TableCell>
                                                </TableRow>
                                            })
                                        }
                                    </TableBody>
                                    <TableFooter className="sticky z-1 bottom-0 inset-x-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableCell>Tổng tiền</TableCell>
                                            <TableCell className="text-right">{formatCurrency(payroll?.listAllowance.reduce((sum, x) => sum + (x.amount ?? 0), 0) ?? 0)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                        <div>
                            <Label>Cái loại giảm trừ thuế</Label>
                            <div className="overflow-y-auto h-[200px]">
                                <Table className="border">
                                    <TableHeader className="sticky z-10 top-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableHead>Tên khoản</TableHead>
                                            <TableHead className="text-right">Số tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            payroll?.listTaxDeduction.map((x, i) => {
                                                return <TableRow key={i}>
                                                    <TableCell>{x.name}</TableCell>
                                                    <TableCell className="text-right">{formatCurrency(x.amount)}</TableCell>
                                                </TableRow>
                                            })
                                        }
                                    </TableBody>
                                    <TableFooter className="sticky z-1 bottom-0 inset-x-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableCell>Tổng tiền</TableCell>
                                            <TableCell className="text-right">{formatCurrency(payroll?.listTaxDeduction.reduce((sum, x) => sum + (x.amount ?? 0), 0) ?? 0)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                        <div>
                            <Label>Danh sách khoản thưởng</Label>
                            <div className="overflow-y-auto h-[200px]">
                                <Table className="border">
                                    <TableHeader className="sticky z-10 top-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableHead>
                                                <Checkbox />
                                            </TableHead>
                                            <TableHead>Tên khoản</TableHead>
                                            <TableHead className="text-right">Số tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="">
                                        {
                                            listDataBonus
                                            && listDataBonus.data
                                            && listDataBonus.data.metadata
                                            && listDataBonus.data?.metadata.map((x, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>
                                                            <Checkbox checked={listBonusIds.includes(x.id ?? -1)} 
                                                                    onCheckedChange={(e)=>handleChangeBonus(Boolean(e), x.id)}/>
                                                        </TableCell>
                                                        <TableCell>{x.name}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(x.amount)}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }

                                    </TableBody>
                                    <TableFooter className="sticky z-1 bottom-0 inset-x-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Tổng tiền</TableCell>
                                            {
                                                listDataBonus
                                                && listDataBonus.data
                                                && listDataBonus.data.metadata
                                                && <TableCell className="text-right">
                                                    {formatCurrency(listDataBonus.data?.metadata
                                                                .filter(x=>listBonusIds.includes(x.id ??-1))
                                                                .reduce((sum, x) => sum + (x.amount ?? 0), 0) ?? 0)}
                                                </TableCell>
                                            }
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                        <div>
                            <Label>Danh sách khoản trừ</Label>
                            <div className="overflow-y-auto h-[200px]">
                                <Table className="border">
                                    <TableHeader className="sticky z-10 top-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableHead>
                                                <Checkbox />
                                            </TableHead>
                                            <TableHead>Tên khoản</TableHead>
                                            <TableHead className="text-right">Số tiền</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="">
                                        {
                                            listDataDeduction
                                            && listDataDeduction.data
                                            && listDataDeduction.data.metadata
                                            && listDataDeduction.data?.metadata.map((x, i) => {
                                                return (
                                                    <TableRow key={i}>
                                                        <TableCell>
                                                            <Checkbox checked={listDeductionIds.includes(x.id ?? -1)} 
                                                                onCheckedChange={(e)=>handleChangeDeduction(Boolean(e), x.id)}/>
                                                        </TableCell>
                                                        <TableCell>{x.name}</TableCell>
                                                        <TableCell className="text-right">{formatCurrency(x.amount)}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        }

                                    </TableBody>
                                    <TableFooter className="sticky z-1 bottom-0 inset-x-0 bg-[#f8fafc]">
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell>Tổng tiền</TableCell>
                                            {
                                                listDataDeduction
                                                && listDataDeduction.data
                                                && listDataDeduction.data.metadata
                                                && <TableCell className="text-right">
                                                    {formatCurrency(listDataDeduction.data?.metadata
                                                                        .filter(x=>listDeductionIds.includes(x.id ??-1))
                                                                        .reduce((sum, x) => sum + (x.amount ?? 0), 0) ?? 0)}
                                                </TableCell>
                                            }
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </div>
                    </div>
                    <div className="flex space-x-2 justify-start sticky bottom-0 p-4 py-2 bg-white border-t">
                        <SheetClose asChild>
                            <Button size='sm' className='h-8 bg-red-500'>
                                <IoMdClose className='mr-1 h-4 w-4' />Đóng
                            </Button>
                        </SheetClose>
                        <Button disabled={updateDataPayrollDetails.isPending} onClick={handleUpdateForm} size='sm' className='h-8 bg-primary'>
                        {updateDataPayrollDetails.isPending&&<LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white "/>}
                            <FaSave className='mr-1 h-4 w-4' />Cập nhật
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
