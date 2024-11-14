import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
type Props = {
    typeContract: string, 
    department: string, 
    position: string, 
    contracType: string
}

export default function WorkingDepartment({typeContract, department, position, contracType} : Props) {
  return (
    <div className='rounded-xl border bg-card text-card-foreground shadow col-span-2'>
    <div className='flex flex-col space-y-1.5 p-6'>
        <div className='font-semibold leading-none tracking-tight'>
            <div className='flex items-center justify-between'>Bộ phận làm việc</div>
        </div>
    </div>
    <div className='p-6 pt-0 pl-2 ml-4'>
        <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
            <Label htmlFor="email">Loại nhân viên</Label>
            <Input disabled={true} placeholder="Email" value={typeContract} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
            <Label htmlFor="email">Phòng ban</Label>
            <Input disabled={true} placeholder="Password" value={department} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
            <Label htmlFor="email">Vị trí</Label>
            <Input disabled={true} placeholder="Email" value={position} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5 p-1">
            <Label htmlFor="email">Loại hợp đồng</Label>
            <Input disabled={true} placeholder="Email" value={contracType} />
        </div>
    </div>
</div>
  )
}
