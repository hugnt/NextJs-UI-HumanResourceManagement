/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';

import React from 'react'

import Account from './_components/account';
import employeeApiRequest from '@/apis/employee.api';
import { useQuery } from '@tanstack/react-query';
import Information from './_components/information';
import WorkingDepartment from './_components/working-department';
import InforSalary from './_components/infor-salary';
import SignContract from './_components/contract-file';
const pathList: Array<PathItem> = [
    { name: "Profile", url: "/profile" },
];
const QUERY_KEY = {
    KEY: 'profile',
}
export default function page() {
    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEY.KEY],
        queryFn: () => employeeApiRequest.getCurrentUserProfile()
    })
    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Profile</h2>
                    <AppBreadcrumb pathList={pathList} className="mt-2" />
                </div>
            </div>
            {
                isLoading ? <></> :
                    <>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                            <Account userName={data!.metadata!.userName!} password={data!.metadata!.password!} email={data!.metadata!.email!} />
                            <Information
                                name={data!.metadata!.name!}
                                dob={data!.metadata!.dob!}
                                address={data!.metadata!.address!}
                                gender={data!.metadata!.gender!}
                                countrySide={data!.metadata!.countryside!}
                                nationalId={data!.metadata!.nationalId!}
                                level={data!.metadata!.level!}
                                major={data!.metadata!.major!}
                            />
                        </div>
                        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-8'>
                            <WorkingDepartment
                                typeContract={data!.metadata!.typeContract!}
                                department={data!.metadata!.departmentName!}
                                position={data!.metadata!.positionName!}
                                contracType={data!.metadata!.contractTypeName!}
                            />
                            <InforSalary
                                baseSalary={data!.metadata!.baseSalary!}
                                baseInsurance={data!.metadata!.baseInsurance!}
                                requiredDays={data!.metadata!.requiredDays!}
                                requriedHours={data!.metadata!.requiredHours!}
                                wageDaily={data!.metadata!.wageDaily!}
                                wageHourly={data!.metadata!.wageHourly!}
                                factor={data!.metadata!.factor!}
                            />
                        </div>
                        <div className='my-8'>
                            <SignContract contractId={data!.metadata!.contractId ?? 0}
                                name={data!.metadata!.name!}
                                fileUrlBase={data!.metadata!.fireUrlBase!}
                                fileUrlSigned={data!.metadata!.fileUrlSigned!}
                                employeeSignStatus={data!.metadata!.employeeSignStatus!} />

                        </div>
                    </>

            }

        </>
    )
}
