'use client'
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Select as Select2, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParams } from 'next/navigation'
import contractTypeApiRequest from '@/apis/contractType.api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Contract, contractDefault, ContractForm, contractSchemaForm } from '@/data/schema/contract.schema';
import allowanceApiRequest from '@/apis/allowance.api';
import contractSalaryApiRequest from '@/apis/contractSalary.api';
import departmentApiRequest from '@/apis/department.api';
import insuranceApiRequest from '@/apis/insurance.api';
import positionApiRequest from '@/apis/position.api';
import contractApiRequest from '@/apis/contract.api';
import { Button } from '@/components/custom/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import applicantApiRequest from '@/apis/candidate.api';
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

const QUERY_KEY = {
    keyList: "contracts",
    keySubContractType: "contractTypes",
    keySubDepartment: "departments",
    keySubPosition: "positions",
    keySubContractSalary: "contractSalarys",
    keySubAllowance: "allowances",
    keySubInsurance: "insurances",
    keySubApplicant: "applicants",
}

export default function page() {
    const params = useParams<{ applicantId: string }>();
    const id = Number(params.applicantId);
    const [isDisabled] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");

    const { mutate, isPending } = useMutation({
        mutationFn: (body: Contract) => contractApiRequest.addnew(id, body),
        onSuccess: () => {

        }
    });

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
    const listDataApplicant = useQuery({
        queryKey: [QUERY_KEY.keySubApplicant, id],
        queryFn: () => applicantApiRequest.getList()
    });


    //List Option
    const allowanceListOptions = listDataAllowance.data?.metadata?.map((item, i) => {
        return {
            label: `Name: ${item.name} - Amount: ${item.amount}`,
            value: item.id,
        };
    });

    const insuranceListOptions = listDataInurance.data?.metadata?.map((item, i) => {
        return {
            label: `Name: ${item.name} - Company: ${item.percentCompany}% - Employee: ${item.percentEmployee}%`,
            value: item.id, // Assuming `item.id` is the identifier for each allowance
        };
    });

    const onSubmit = (data: Contract) => {
        console.log("data: ", data)
        mutate(data)
    };
    const form = useForm<ContractForm>({
        resolver: zodResolver(contractSchemaForm),
        defaultValues: contractDefault,
    });

    useEffect(() => {
        const applicants = listDataApplicant?.data?.metadata;
        const applicant = applicants?.find(
            (item) => item.id !== undefined && item.id === id
        );
        var contract1: Contract = {
            name: applicant?.name,
        };
        console.log("contract1", contract1)
        setEmail(applicant?.email??"");
        form.reset(contract1);
    }, [listDataApplicant.data])
    //call api get apllicant by id => name, Email, ...
    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
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
                                    <FormField control={form.control} name="name" render={({ field }) => (
                                        <FormItem className="col-span-2">
                                            <FormLabel>Họ Và Tên Nhân Viên</FormLabel>
                                            <FormControl>
                                                <Input {...field} value={field.value??"undefined"} disabled={true} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <FormField control={form.control} name="contractTypeId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Loại Hợp Đồng</FormLabel>
                                                <Select2 onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                                                    <FormControl >
                                                        <SelectTrigger >
                                                            <SelectValue placeholder="Chọn loại hợp đồng" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {
                                                            listDataContractType.data?.metadata?.map((item, index) => {
                                                                return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                                                            })
                                                        }
                                                    </SelectContent>
                                                </Select2>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <Label htmlFor="typeContract">Loại nhân viên</Label>
                                    <Select2>
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
                                    </Select2>
                                </div>
                            </div>
                            <div>
                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <Label htmlFor="email">Email</Label>
                                    <Input type="text" value={email} disabled={true} />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <FormField control={form.control} name="startDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày Bắt Đầu Hợp Đồng</FormLabel>
                                                <FormControl>
                                                    <Input type="date"
                                                        onChange={field.onChange}
                                                        value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <FormField control={form.control} name="endDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ngày Kết Thúc Hợp Đồng</FormLabel>
                                                <FormControl>
                                                    <Input type="date"
                                                        onChange={field.onChange}
                                                        value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="contractSalaryId"
                                        render={({ field }) => (
                                            <FormItem className="col-span-2">
                                                <FormLabel>Quy Định Lương</FormLabel>
                                                <Select2 onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                                                    <FormControl >
                                                        <SelectTrigger >
                                                            <SelectValue placeholder="Chọn quy định lương" />
                                                        </SelectTrigger>
                                                    </FormControl>
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
                                                </Select2>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="allowanceIds"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Trợ Cấp</FormLabel>
                                                <Select
                                                    onChange={(selectedOptions) => {
                                                        field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                                                    }}
                                                    value={allowanceListOptions?.filter(option => field.value?.includes(option.value ?? 0))}
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    options={allowanceListOptions}
                                                    isDisabled={isDisabled}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <FormField
                                        control={form.control}
                                        name="insuranceIds"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Bảo Hiểm</FormLabel>
                                                <Select
                                                    onChange={(selectedOptions) => {
                                                        field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                                                    }}
                                                    value={insuranceListOptions?.filter(option => field.value?.includes(option.value ?? 0))}
                                                    closeMenuOnSelect={false}
                                                    isMulti
                                                    options={insuranceListOptions}
                                                    isDisabled={isDisabled}
                                                />
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end pr-20">
                        <Button loading={isPending} size='sm' type='submit'>Gửi email</Button>
                        {/* Hợp đòng mới được tạo -> có id là: k */}
                        {/* Kiểm tra gửi email thành công => click vào đường dẫn => employee-shared/emnployee-information/id->{k}của hợp đồng*/}
                    </div>
                </form>
            </Form>
        </>
    )
}

