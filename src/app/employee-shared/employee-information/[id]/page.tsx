"use client"
import newEmployeeApiRequest from "@/apis/newEmployee.api";
import { Button } from "@/components/custom/button";
import { newEmployee, newEmployeeDefault } from "@/data/schema/newEmployee.schema";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";

export default function NewPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const { register, handleSubmit, setValue } = useForm<newEmployee>({
        defaultValues: newEmployeeDefault,
    });

    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const onSubmit = async (data: newEmployee) => {
        try {
            await newEmployeeApiRequest.update(id, data);
            setSuccessMessage("Thông tin nhân viên đã được lưu thành công!");
        } catch (error) {
            console.error("Lỗi khi tạo nhân viên mới:", error);
            setSuccessMessage(null);
        }
    };

    return (
        <>
            <div className='mb-2 flex items-center justify-between space-y-2'>
                <div>
                    <h2 className='text-2xl font-bold tracking-tight'>Hợp đồng nhân viên</h2>
                </div>
            </div>

            {successMessage && (
                <div className="mb-4 p-4 text-green-600 bg-green-100 border border-green-300 rounded">
                    {successMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
                <div className='w-full mx-auto grid grid-cols-2 gap-2'>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="name">Tên</Label>
                            <Input {...register("name")} placeholder="Tên ứng viên" />
                        </div>

                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                            <Input type="date" {...register("dateOfBirth")} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="gender">Giới tính</Label>
                            <Select
                                {...register("gender")}
                                onValueChange={(value) => setValue("gender", value === "true")}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Giới tính</SelectLabel>
                                        <SelectItem value="true">Nam</SelectItem>
                                        <SelectItem value="false">Nữ</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="address">Địa chỉ</Label>
                            <Input {...register("address")} placeholder="Địa chỉ" />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="countrySide">Quê quán</Label>
                            <Input {...register("countrySide")} placeholder="Khu vực" />
                        </div>
                    </div>
                    <div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="nationalID">CMND/CCCD</Label>
                            <Input {...register("nationalID")} placeholder="Số CMND/CCCD" />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="nationalStartDate">Ngày làm căn cước</Label>
                            <Input type="date" {...register("nationalStartDate")} />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="nationalAddress">Địa chỉ quốc gia</Label>
                            <Input {...register("nationalAddress")} placeholder="Địa chỉ quốc gia" />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="level">Cấp bậc</Label>
                            <Input {...register("level")} placeholder="Cấp bậc" />
                        </div>
                        <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                            <Label htmlFor="major">Chuyên ngành</Label>
                            <Input {...register("major")} placeholder="Chuyên ngành" />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end pr-20">
                    <Button type="submit" >Lưu</Button>
                </div>
            </form>
        </>
    );
}