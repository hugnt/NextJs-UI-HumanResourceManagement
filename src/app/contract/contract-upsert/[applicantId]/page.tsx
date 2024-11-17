'use client'
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
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
export default function page() {
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
                            <Label htmlFor="email">Tên</Label>
                            <Input type="text" value="Lã Hồng Phúc" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Loại hợp đồng</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại hợp đồng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Loại hợp đồng</SelectLabel>
                                        <SelectItem value="apple">Hợp đồng có thời hạn</SelectItem>
                                        <SelectItem value="banana">Hợp đồng không thời hạn</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Ngày bắt đầu làm</Label>
                            <Input type="text" value="11/4/2023" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Ngày kết thúc hợp đồng</Label>
                            <Input type="text" value="11/4/2025" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Loại nhân viên</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại nhân viên" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Loại nhân viên</SelectLabel>
                                        <SelectItem value="apple">Nhân viên fulltime</SelectItem>
                                        <SelectItem value="banana">Nhân viên partime</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Email</Label>
                            <Input type="text" value="phucminhbeos@gmail.com" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Ngày tạo hợp đồng</Label>
                            <Input type="text" value="10/04/2024" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Vị trí</Label>
                            <Input type="text" value="Kĩ sư phần mềm" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Phòng ban</Label>
                            <Input type="text" value="Công nghệ thông tin" placeholder="Tên ứng viên" disabled={true} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="email">Chọn loại hơp đồng lương</Label>
                            <Select>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại hơp đồng lương" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Loại hợp đồng lương</SelectLabel>
                                        <SelectItem value="apple">
                                            <div className='text-[14px]'>
                                                <p>Lương cơ bản :<strong>1.000.000VND</strong></p>
                                                <p>Lương bảo hiểm :<strong>1.000.000VND</strong></p>
                                                <p>Số ngày quy định làm việc :<strong>25 ngày</strong></p>
                                                <p>Số giờ quy định làm việc :<strong>8 giờ/ngày</strong></p>
                                                <p>Lương hàng ngày :<strong>500.000VND</strong></p>
                                                <p>Lương hàng giờ :<strong>100.000VND/h</strong></p>
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="banana">
                                            <div className='text-[14px]'>
                                                <p>Lương cơ bản :<strong>1.000.000VND</strong></p>
                                                <p>Lương bảo hiểm :<strong>1.000.000VND</strong></p>
                                                <p>Số ngày quy định làm việc :<strong>25 ngày</strong></p>
                                                <p>Số giờ quy định làm việc :<strong>8 giờ/ngày</strong></p>
                                                <p>Lương hàng ngày :<strong>500.000VND</strong></p>
                                                <p>Lương hàng giờ :<strong>100.000VND/h</strong></p>
                                            </div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end pr-20">
                <Button>Gửi email nhập thông tin cá nhân</Button>
                {/* Hợp đòng mới được tạo -> có id là: k */}
                {/* Kiểm tra gửi email thành công => click vào đường dẫn => employee-shared/emnployee-information/id->{k}của hợp đồng*/}
            
            </div>
        </>
    )
}
