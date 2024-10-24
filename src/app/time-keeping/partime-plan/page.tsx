"use client"
import React from 'react'
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import Card from './_components/card';
import { useQuery } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
import { StatusCalendar } from '@/data/schema/work-shift.schema';
const pathList: Array<PathItem> = [
    {
        name: "TimeKeeping",
        url: "/time-keeping"
    },
    {
        name: "Partime Plan",
        url: "/time-keeping/partime-plan"
    },
];

const QUERY_KEY = {
    KEY: "partime-plans"
}
const statusMap = [
    { label: "SUBMIT", status: StatusCalendar.Submit },
    { label: "APPROVED", status: StatusCalendar.Approved },
    { label: "REFUSE", status: StatusCalendar.Refuse },
    { label: "CANCEL", status: StatusCalendar.Cancel },
];


export default function page() {
    const { data } = useQuery({
        queryKey: [QUERY_KEY.KEY],
        queryFn: () => workShiftApiRequest.getAllPartimePlans(),
    });

    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Partime Plan</h2>
                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                </div>
            </div>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[550px] rounded-lg border mb-4"
            >
                {data?.metadata && (
                    <ResizablePanelGroup direction="horizontal" className="min-h-[550px] rounded-lg border mb-4">
                        {statusMap.map(({ label, status }) => (
                            <>
                                <ResizableHandle />
                                <ResizablePanel key={label} defaultSize={25} minSize={25} className="h-full">
                                    <div className="flex flex-col">
                                        <div className="sticky top-0 bg-white p-4 shadow z-10">
                                            <h3 className="font-semibold">{label}</h3>
                                        </div>
                                        <div className='overflow-y-auto h-[500px] overflow-x-hidden mt-2'>
                                            {data.metadata!.filter(item => item.statusCalendar == status)
                                                .map((item, index) => (
                                                    <Card key={index} partimePlanResult={item}/>
                                                ))}
                                        </div>
                                    </div>
                                </ResizablePanel>
                            </>


                        ))}
                    </ResizablePanelGroup>
                )}
            </ResizablePanelGroup>
        </>

    )
}

