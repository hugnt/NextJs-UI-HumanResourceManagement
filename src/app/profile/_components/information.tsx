import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'
type Props = {
    name: string,
    dob: string,
    address: string,
    gender: string,
    countrySide: string,
    nationalId: string,
    level: string,
    major: string
}

export default function Information({ name, dob, address, gender, countrySide, nationalId, level, major }: Props) {
    return (
        <div className='rounded-xl border bg-card text-card-foreground shadow col-span-5 ml-4'>
            <div className='flex flex-col space-y-1.5 p-6'>
                <div className='font-semibold leading-none tracking-tight'>Thông tin cá nhân</div>
            </div>
            <div className='p-6 pt-0 pl-2'>
                <div className='flex items-center justify-between ml-4'>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Họ và tên</Label>
                        <Input disabled={true} value={name}/>
                    </div>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Ngày sinh</Label>
                        <Input disabled={true} value={dob}/>
                    </div>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Địa chỉ</Label>
                        <Input disabled={true} value={address}/>
                    </div>
                </div>
                <div className='flex items-center justify-between ml-4'>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Giới tính</Label>
                        <Input disabled={true} value={gender}/>
                    </div>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Quê quán</Label>
                        <Input disabled={true} value={countrySide}/>
                    </div>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Số chứng minh thư</Label>
                        <Input disabled={true} value={nationalId}/>
                    </div>
                </div>
                <div className='flex items-center ml-4'>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Trình độ học vấn</Label>
                        <Input disabled={true} value={level}/>
                    </div>
                    <div className="grid w-1/3 max-w-sm items-center gap-1.5 p-1">
                        <Label htmlFor="email">Chuyên ngành</Label>
                        <Input disabled={true} value={major}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
