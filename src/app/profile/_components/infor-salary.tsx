import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
type Props = {
    baseSalary: number,
    baseInsurance: number,
    requiredDays: number,
    requriedHours: number,
    wageDaily: number,
    wageHourly: number,
    factor: number
}
export default function InforSalary({ baseSalary, baseInsurance, requiredDays, requriedHours, wageDaily, wageHourly, factor }: Props) {
    return (
        <div className='rounded-xl border bg-card text-card-foreground shadow col-span-5 ml-4'>
            <div className='flex flex-col space-y-1.5 p-6'>
                <div className='font-semibold leading-none tracking-tight'>Thông tin mức lương</div>
            </div>
            <div className='p-6 pt-0 pl-2'>
                <div className='flex items-center justify-between ml-4'>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Mức lương cơ bản</Label>
                        <Input disabled={true} value={baseSalary} />
                    </div>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Mức bảo hiểm cơ bản</Label>
                        <Input disabled={true} value={baseInsurance} />
                    </div>
                </div>
                <div className='flex items-center justify-between ml-4'>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Số ngày bắt buộc</Label>
                        <Input disabled={true} value={requiredDays} />
                    </div>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Số giờ bắt buộc</Label>
                        <Input disabled={true} value={requriedHours} />
                    </div>
                </div>
                <div className='flex items-center justify-between ml-4'>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Lương theo ngày</Label>
                        <Input disabled={true} value={wageDaily} />
                    </div>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Lương theo giờ</Label>
                        <Input disabled={true} value={wageHourly} />
                    </div>
                </div>
                <div className='flex items-center ml-4'>
                    <div className="grid w-1/2 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Hệ số lương</Label>
                        <Input disabled={true} value={factor} />
                    </div>
                </div>
            </div>
        </div>
    )
}
