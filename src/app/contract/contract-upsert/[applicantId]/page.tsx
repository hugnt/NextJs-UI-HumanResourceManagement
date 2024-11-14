'use client'
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button';
import contractTypeApiRequest from '@/apis/contractType.api';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Contract, contractDefault } from '@/data/schema/contract.schema';
import allowanceApiRequest from '@/apis/allowance.api';
import contractSalaryApiRequest from '@/apis/contractSalary.api';
import departmentApiRequest from '@/apis/department.api';
import insuranceApiRequest from '@/apis/insurance.api';
import positionApiRequest from '@/apis/position.api';
import contractApiRequest from '@/apis/contract.api';
const pathList: Array<PathItem> = [
    {
        name: "Contract",
        url: "/contract"
    },
    {
        name: "Add Contract",
        url: "/contract/contract-upsert"
    },
];
const { register, handleSubmit } = useForm<Contract>({
    defaultValues: contractDefault,
});
const [, setSuccessMessage] = useState<string | null>(null);
const QUERY_KEY = {
    keyList: "contracts",
    keySubContractType: "contractTypes",
    keySubDepartment: "departments",
    keySubPosition: "positions",
    keySubContractSalary: "contractSalarys",
    keySubAllowance: "allowances",
    keySubInsurance: "insurances",
}
//List data
const listDataContractType = useQuery({
    queryKey: [QUERY_KEY.keySubContractType],
    queryFn: () => contractTypeApiRequest.getList()
});
const listDataDepartment = useQuery({
    queryKey: [QUERY_KEY.keySubDepartment],
    queryFn: () => departmentApiRequest.getList()
});
const listDataPosition = useQuery({
    queryKey: [QUERY_KEY.keySubPosition],
    queryFn: () => positionApiRequest.getList()
});
const listDataContractSalary = useQuery({
    queryKey: [QUERY_KEY.keySubContractSalary],
    queryFn: () => contractSalaryApiRequest.getList()
});
const listDataAllowance = useQuery({
    queryKey: [QUERY_KEY.keySubAllowance],
    queryFn: () => allowanceApiRequest.getList()
});
const listDataInurance = useQuery({
    queryKey: [QUERY_KEY.keySubInsurance],
    queryFn: () => insuranceApiRequest.getList()
});
export default function page() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const onSubmit = async (data: Contract) => {
        try {
            await contractApiRequest.addnew(id, data);
            setSuccessMessage("Thông tin nhân viên đã được lưu, email đã được gửi!");
        } catch (error) {
            console.error("Lỗi khi tạo nhân viên mới:", error);
            setSuccessMessage(null);
        }
    };
    //call api get apllicant by id => name, Email, ...
    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Hợp đồng nhân viên</h2>
                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                </div>
            </div>

            <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                <div className='w-full mx-auto grid grid-cols-2 gap-2'>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="name">Tên</Label>
                            <Input type="text" value="Lã Hồng Phúc" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="contractTypeId">Loại hợp đồng</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại hợp đồng" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        listDataContractType.data?.metadata?.map((item, index) => {
                                            return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="typeContract">Loại nhân viên</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại nhân viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={"1"}>
                                        Partime
                                    </SelectItem>
                                    <SelectItem value={"2"}>
                                        Fulltime
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Email</Label>
                            <Input type="text" value="phucminhbeos@gmail.com" placeholder="email cua ung vien" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="startDate">Ngày tạo hợp đồng</Label>
                            <Input type="date" {...register("startDate")} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="endDate">Ngày kết thúc hợp đồng</Label>
                            <Input type="date" {...register("endDate")} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="positionId">Vị trí</Label>
                            <SelectContent>
                                {
                                    listDataPosition.data?.metadata?.map((item, index) => {
                                        return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="departmentId">Phòng ban</Label>
                            <SelectContent>
                                {
                                    listDataDepartment.data?.metadata?.map((item, index) => {
                                        return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                                    })
                                }
                            </SelectContent>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="contractSalaryId">Chọn loại hơp đồng lương</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại hơp đồng lương" />
                                </SelectTrigger>
                                <SelectContent>
                                    {
                                        listDataContractSalary.data?.metadata?.map((item, index) => {
                                            return <SelectItem key={index} value={item.id?.toString() ?? "0"}>
                                                Base Salary: {item.baseSalary}<br />
                                                Base Insurance: {item.baseInsurance}<br />
                                                Factor: {item.factor}<br />
                                                Required Days: {item.requiredDays}<br />
                                                Required Hours: {item.requiredHours}<br />
                                                Wage Daily: {item.wageDaily}<br />
                                                Wage Hourly: {item.wageHourly}<br />
                                            </SelectItem>
                                        })
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end pr-20">
                <Button size='sm' onClick={() => handleSubmit(onSubmit)}>Gửi email</Button>
                {/* Hợp đòng mới được tạo -> có id là: k */}
                {/* Kiểm tra gửi email thành công => click vào đường dẫn => employee-shared/emnployee-information/id->{k}của hợp đồng*/}
            </div>
        </>
    )
}

