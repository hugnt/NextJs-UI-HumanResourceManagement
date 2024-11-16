"use client"
import React, { useMemo } from 'react'
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
import { useCurrentUser } from '@/app/system/ui/auth-context';
import { Role } from '@/data/schema/auth.schema';
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
    KEY: "partime-plans",
    KEY_CURRENT: "partime-plans-by-current"
}
const statusMap = [
    { label: "SUBMIT", status: StatusCalendar.Submit },
    { label: "APPROVED", status: StatusCalendar.Approved },
    { label: "REFUSE", status: StatusCalendar.Refuse },
    { label: "CANCEL", status: StatusCalendar.Cancel },
];


export default function page() {
    const user = useCurrentUser().currentUser;
    const { data } = useQuery({
        queryKey: [QUERY_KEY.KEY],
        queryFn: () => workShiftApiRequest.getAllPartimePlans(),
        enabled: user!.role === Role.Admin
    });
    const { data: dataByCurrentUser } = useQuery({
        queryKey: [QUERY_KEY.KEY_CURRENT],
        queryFn: () => workShiftApiRequest.getAllPartimePlanByCurrentEmployeeId(),
        enabled: user!.role === Role.Partime
    });
    

    const relevantData = useMemo(() => {
        return user!.role === Role.Admin ? data : dataByCurrentUser;
    }, [user!.role, data, dataByCurrentUser]);

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
                {relevantData && (
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

                                            {relevantData.metadata!.filter(item => item.statusCalendar == status)
                                                .map((item, index) => (
                                                    <Card key={index} partimePlanResult={item} />
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

