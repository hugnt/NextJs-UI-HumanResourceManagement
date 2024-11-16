"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import React from 'react'
const pathList: Array<PathItem> = [
    {
        name: "Dashboard",
        url: "/dashboard",
    },
    {
        name: "Flexible Dashboard",
        url: "/dashboard/partime-plan"
    },
];
import { useMutation, useQuery } from '@tanstack/react-query';
import employeeApiRequest from '@/apis/employee.api';
import { handleSuccessApi } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/custom/button';
import { FaEye } from "react-icons/fa";
const QUERY_KEY = {
    KEY: 'flexible-dashboard',
    MUTATE: 'create-flexible-dashboard',
}
type Props = {
    data?: Value[],
    title?: string,
    first_des?: string,
    second_des?: string
}
type Value = {
    label: string,
    value: number
}
export default function page() {
    const router = useRouter();
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEY.KEY],
        queryFn: () => employeeApiRequest.getAllFlexibleDashboard()
    })
    

    const { mutate, isPending } = useMutation({
        mutationKey: [QUERY_KEY.MUTATE],
        mutationFn: () => employeeApiRequest.createNewPageFlexibleDashboard(),
        onSuccess(data, variables, context) {
            if (data.isSuccess) {
                router.push(`/dashboard/flexible-dashboard/${data.metadata}?title=${data.metadata!.title}`)
                handleSuccessApi({ message: "Tạo mới thành công !" })
            }
        },
    })
    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Flexible Dashboard</h2>
                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                </div>
            </div>
            <div className='mt-10'>
                <div className='mt-4 flex items-center justify-between'>
                    <p className='text-lg text-gray-500'>Flexible Dashboard All Pages</p>
                    <Button loading={isPending} onClick={() => mutate()}>Tạo mới</Button>
                </div>
                <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-12'>
                    {
                        data?.metadata?.map((item, index) => {
                            return <div className='rounded-xl border bg-card text-card-foreground shadow col-span-3'>
                                <div className='flex flex-col space-y-1.5 p-6'>
                                    <div className='font-semibold leading-none tracking-tight'>
                                        <div className='flex items-center justify-between'>
                                            <p>Page {index + 1}</p>
                                            <FaEye onClick={() => { router.push(`/dashboard/flexible-dashboard/${item.id}?title=${item.title == null ? "Ghi tiêu đề ở đây" : item.title}`) }} className='ml-6 text-center cursor-pointer transition-transform duration-200 hover:text-gray-400' />
                                        </div>
                                    </div>
                                </div>
                                <div className='p-6 pt-0 pl-2 ml-4'>
                                    <img src={item.url} alt="" />
                                </div>
                            </div>
                        })
                    }
                </div>
            </div>      
        </>
    )
}
