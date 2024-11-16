"use client"
import employeeApiRequest from '@/apis/employee.api'
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import { Input } from '@/components/ui/input';
import { Chart, chartDefault, ChartType } from '@/data/schema/flexibleDashboard.schema';
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react'
import { FaPen } from 'react-icons/fa';
import { BarChartHorizontal } from '../_components/barchart-horizontal';
import { Button } from '@/components/custom/button';
import { CRUD_MODE } from '@/data/const';
import FormCRUD, { labelResult } from '../_components/form-crud';
import { BarChartVertical } from '../_components/barchart-vertical';
import { PieChartCustom } from '../_components/pie-chart';
import { RadialChartCustom } from '../_components/radial-chart';
const QUERY_KEY = {
    KEY: 'charts',
}
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



export default function page({ params }: { params: { flexibleId: number } }) {
    const searchParams = useSearchParams();
    const name = searchParams.get('title')!.toString();
    const [detail, setDetail] = useState<Chart>({});
    const [openCRUD, setOpenCRUD] = useState<boolean>(false);
    const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

    //State
    const [isChange, setIsChange] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(name == null ? "" : name);

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEY.KEY],
        queryFn: () => employeeApiRequest.getAllChartByPageFlexibleId(params.flexibleId)
    })



    const handleAddNew = () => {
        setDetail(chartDefault);
        setMode(CRUD_MODE.ADD)
        setOpenCRUD(true);
    };
    const parseLabelResults = (jsonString: string): labelResult[] => {
        try {
            // Phân tích chuỗi JSON
            const labelResults: labelResult[] = JSON.parse(jsonString);
            return labelResults;
        } catch (error) {
            console.error("Invalid JSON format:", error);
            return [];
        }
    };
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
                    <p className='text-lg text-gray-500'>Charts In Flexible Dashboard</p>
                    <Button onClick={() => handleAddNew()}>Tạo mới</Button>
                </div>
                <div className='flex items-center justify-center'>
                    {isChange ?
                        <Input onChange={(e) => setTitle(e.target.value)} className='w-[250px]' type="text" placeholder="Tiêu đề" value={title} /> :
                        <h1 className='text-[20px] text-gray-500 uppercase'>{title == "" ? "Ghi tiêu đề ở đây" : title}</h1>}
                    <FaPen onClick={() => setIsChange(!isChange)} className='ml-6 text-center cursor-pointer transition-transform duration-200 hover:text-gray-400' />
                </div>
                <div className='mt-4'>
                    <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                        {
                            data?.metadata?.map((item, index) => {
                                return <div key={index} className={`col-span-${item.size}`} onDoubleClick={() => { }}>
                                    {item.chartType == ChartType.BarChartHorizontal ? <BarChartHorizontal title={item.title} data={parseLabelResults(item.data)} firstDescription={item.firstDescription} secondDescription={item.secondDescription} /> : <></>}
                                    {item.chartType == ChartType.BarChartVertical ? <BarChartVertical title={item.title} data={parseLabelResults(item.data)} first_description={item.firstDescription} second_description={item.secondDescription} /> : <></>}
                                    {item.chartType == ChartType.PieChart ? <PieChartCustom title={item.title} data={parseLabelResults(item.data)} firstDescription={item.firstDescription} secondDescription={item.secondDescription} /> : <></>}
                                    {item.chartType == ChartType.RadialChart ? <RadialChartCustom title={item.title} data={parseLabelResults(item.data)} firstDescription={item.firstDescription} secondDescription={item.secondDescription} /> : <></>}
                                </div>
                            })
                        }
                    </div>
                </div>
                <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} pageFlexibleDashboardId={params.flexibleId} />
            </div>
        </>
    )
}
