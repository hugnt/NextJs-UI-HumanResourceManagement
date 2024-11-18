"use client"
import newEmployeeApiRequest from "@/apis/newEmployee.api";
import { Button } from "@/components/custom/button";
import { newEmployee, newEmployeeDefault } from "@/data/schema/newEmployee.schema";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect } from 'react';
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
import { useQuery } from "@tanstack/react-query";
import contractApiRequest from "@/apis/contract.api";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { handleSuccessApi } from "@/lib/utils";
import { useRouter } from 'next/navigation'


export default function NewEmployeeJoinInPage() {
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    const { register, handleSubmit, setValue } = useForm<newEmployee>({
        defaultValues: newEmployeeDefault,
    });
    const listDataContract = useQuery({
        queryKey: ["contracts"],
        queryFn: () => contractApiRequest.getList()
    });
    const router = useRouter();


    const onSubmit = async (data: newEmployee) => {
        try {
            await newEmployeeApiRequest.update(id, data);
            handleSuccessApi({title:"Thông tin nhân viên đã được lưu thành công!"});
            router.push(`/`)
        } catch (error) {
            console.error("Lỗi khi tạo nhân viên mới:", error);
            //handleSuccessApi({title:"Thông tin nhân viên đã được lưu thành công!"});
        }
    };
    useEffect(() => {
        const contracts = listDataContract?.data?.metadata;
        const contract = contracts?.find(
            (item) => item.id !== undefined && item.id === id
        );
        setValue("name", contract?.name ?? "");
    }, [listDataContract.data])

    return (
        <div className="w-full h-screen bg-primary pt-10">
            <Card className="w-2/3 mx-auto ">
                <div className=''>
                    <CardHeader className="pb-2">
                        <Image src={'/images/logo-clip.jpg'} alt='logo' width={100} height={40} />
                        <CardTitle className='text-2xl font-bold tracking-tight'>Thông tin hồ sơ nhân viên</CardTitle>
                        <CardDescription>Nhân viên mới điền các thông tin cơ bản để công ty tiến hành tạo hợp đồng</CardDescription>
                    </CardHeader>
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className=''>
                        <div className='grid grid-cols-2 gap-2'>
                            <div>
                                <div className="grid w-full max-w-sm items-center gap-1.5 mt-6">
                                    <Label htmlFor="name">Tên</Label>
                                    <Input type="text" {...register("name")} />
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
                        <div className="mt-6 flex justify-start">
                            <Button type="submit" >Gửi hồ sơ</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}