"use client";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useState } from "react";
import {
  Select as Select2,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "next/navigation";
import contractTypeApiRequest from "@/apis/contractType.api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Contract,
  contractDefault,
  ContractForm,
  contractSchemaForm,
} from "@/data/schema/contract.schema";
import allowanceApiRequest from "@/apis/allowance.api";
import contractSalaryApiRequest from "@/apis/contractSalary.api";
import insuranceApiRequest from "@/apis/insurance.api";
import contractApiRequest from "@/apis/contract.api";
import { Button } from "@/components/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import applicantApiRequest from "@/apis/candidate.api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { handleSuccessApi } from "@/lib/utils";
import { FaRegCircleCheck } from "react-icons/fa6";
import Link from "next/link";


const QUERY_KEY = {
  keyList: "contracts",
  keySubContractType: "contractTypes",
  keySubDepartment: "departments",
  keySubPosition: "positions",
  keySubContractSalary: "contractSalarys",
  keySubAllowance: "allowances",
  keySubInsurance: "insurances",
  keySubApplicant: "applicants",
};

export default function CreateContractByApplicant() {
  const params = useParams<{ applicantId: string }>();
  const id = Number(params.applicantId);
  const [isDisabled] = useState<boolean>(false);
  const [isFinishedAction, setIsFinishedAction] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: (body: Contract) => contractApiRequest.addnew(id, body),
    onSuccess: () => {
      handleSuccessApi({ title: "Tạo hợp đồng thành công!", message: 'form điền thông tin đã được gửi qua email ứng viên' })
    },
  });

  //List data
  const listDataContractType = useQuery({
    queryKey: [QUERY_KEY.keySubContractType],
    queryFn: () => contractTypeApiRequest.getList(),
  });
  const listDataContractSalary = useQuery({
    queryKey: [QUERY_KEY.keySubContractSalary],
    queryFn: () => contractSalaryApiRequest.getList(),
  });
  const listDataAllowance = useQuery({
    queryKey: [QUERY_KEY.keySubAllowance],
    queryFn: () => allowanceApiRequest.getList(),
  });
  const listDataInurance = useQuery({
    queryKey: [QUERY_KEY.keySubInsurance],
    queryFn: () => insuranceApiRequest.getList(),
  });
  const listDataApplicant = useQuery({
    queryKey: [QUERY_KEY.keySubApplicant, id],
    queryFn: () => applicantApiRequest.getList(),
  });

  //List Option
  const allowanceListOptions = listDataAllowance.data?.metadata?.map((item) => {
    return {
      label: `Name: ${item.name} - Amount: ${item.amount}`,
      value: item.id,
    };
  });

  const insuranceListOptions = listDataInurance.data?.metadata?.map((item) => {
    return {
      label: `Name: ${item.name} - Company: ${item.percentCompany}% - Employee: ${item.percentEmployee}%`,
      value: item.id, // Assuming `item.id` is the identifier for each allowance
    };
  });

  const onSubmit = (data: Contract) => {
    console.log("data: ", data);
    mutate(data);
  };
  const form = useForm<ContractForm>({
    resolver: zodResolver(contractSchemaForm),
    defaultValues: contractDefault,
  });

  useEffect(() => {
    setIsFinishedAction(false);
  }, [id])

  useEffect(() => {
    const applicants = listDataApplicant?.data?.metadata;
    const applicant = applicants?.find(item => item.id !== undefined && item.id === id);
    const contract1: Contract = {
      name: applicant?.name,
    };
    console.log("contract1", contract1);
    setEmail(applicant?.email ?? "");
    form.reset(contract1);
  }, [listDataApplicant.data]);
  //call api get apllicant by id => name, Email, ...
  return (
    <div>
      {
        !isFinishedAction ?
          <Card className="w-2/3 mx-auto mt-6">
            <CardHeader className="pb-2" >
              <CardTitle className='text-2xl font-bold tracking-tight'>Tạo hợp đồng cho ứng viên</CardTitle>
              <CardDescription>Tạo hợp đồng mới cho ứng viên được duyệt vào công ty</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-2 gap-x-3">
                    <div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Họ tên ứng viên</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? "undefined"}
                                  disabled={true}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="contractTypeId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại Hợp Đồng</FormLabel>
                              <Select2
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                                disabled={isDisabled}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại hợp đồng" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {listDataContractType.data?.metadata?.map(
                                    (item, index) => {
                                      return (
                                        <SelectItem
                                          key={index}
                                          value={item.id?.toString() ?? "0"}
                                        >
                                          {item.name}
                                        </SelectItem>
                                      );
                                    }
                                  )}
                                </SelectContent>
                              </Select2>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="typeContract"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Loại nhân viên</FormLabel>
                              <Select2
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                                disabled={isDisabled}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn loại nhân viên" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value={"1"}>Partime</SelectItem>
                                  <SelectItem value={"2"}>Fulltime</SelectItem>
                                </SelectContent>
                              </Select2>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="contractSalaryId"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Quy Định Lương</FormLabel>
                              <Select2
                                onValueChange={field.onChange}
                                defaultValue={field.value?.toString()}
                                disabled={isDisabled}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn quy định lương" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {listDataContractSalary.data?.metadata?.map(
                                    (item, index) => {
                                      return (
                                        <SelectItem
                                          key={index}
                                          value={item.id?.toString() ?? "0"}
                                        >
                                          Lương CB: {item.baseSalary}<br />
                                          Mức đóng BH: {item.baseInsurance}<br />
                                          Hệ số: {item.factor}<br />
                                          Số giờ quy định: {item.requiredHours}<br />
                                          Số công (theo giờ): {item.wageHourly}/h
                                        </SelectItem>
                                      );
                                    }
                                  )}
                                </SelectContent>
                              </Select2>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="text" value={email} disabled={true} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày Bắt Đầu Hợp Đồng</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  onChange={field.onChange}
                                  value={
                                    field.value
                                      ? field.value.toString().split("T")[0]
                                      : new Date().toString()
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="endDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ngày Kết Thúc Hợp Đồng</FormLabel>
                              <FormControl>
                                <Input
                                  type="date"
                                  onChange={field.onChange}
                                  value={
                                    field.value
                                      ? field.value.toString().split("T")[0]
                                      : new Date().toString()
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="allowanceIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trợ Cấp</FormLabel>
                              <Select
                                onChange={(selectedOptions) => {
                                  field.onChange(
                                    selectedOptions
                                      ? selectedOptions.map((option) => option.value)
                                      : []
                                  );
                                }}
                                value={allowanceListOptions?.filter((option) =>
                                  field.value?.includes(option.value ?? 0)
                                )}
                                closeMenuOnSelect={false}
                                isMulti
                                options={allowanceListOptions}
                                isDisabled={isDisabled}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                        <FormField
                          control={form.control}
                          name="insuranceIds"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bảo Hiểm</FormLabel>
                              <Select
                                onChange={(selectedOptions) => {
                                  field.onChange(
                                    selectedOptions
                                      ? selectedOptions.map((option) => option.value)
                                      : []
                                  );
                                }}
                                value={insuranceListOptions?.filter((option) =>
                                  field.value?.includes(option.value ?? 0)
                                )}
                                closeMenuOnSelect={false}
                                isMulti
                                options={insuranceListOptions}
                                isDisabled={isDisabled}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid max-w-sm  mt-2">
                        <div className="text-end">
                          <Button loading={isPending} size="sm" type="submit">
                            Tạo và gửi form điền thông tin
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card > :
          <Card className="w-1/3 mx-auto mt-10 bg-green-100">
            <div className="text-center p-10 pb-5">
              <FaRegCircleCheck size={60} className="text-green-500 m-auto" />
              <div className="text-lg mt-2 mb-4">Thao tác hoàn tất</div>
              <Button className="" size={"sm"}>
                <Link href={"/recruitment/applicant"}>
                  Xong
                </Link>
              </Button>
            </div>

          </Card>
      }
    </div>
  );
}
