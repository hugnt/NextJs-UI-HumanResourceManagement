/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import dashboardApiRequest from "@/apis/dashboard.api";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import departmentApiRequest from "@/apis/department.api";
import employeeApiRequest from "@/apis/employee.api";
import contractApiRequest from "@/apis/contract.api";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { Employee } from "@/data/schema/employee.schema";
import { ApiResponse } from "@/data/type/response.type";
import { DepartmentUserCount } from "@/data/schema/department.schema";
import { LabelList, Pie, PieChart, Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Contract, TypeContract } from "@/data/schema/contract.schema";

type DynamicChartConfig = {
  [key: string]: {
    label: string;
    color?: string; // Color is optional for fixed items
  };
};


//react query key
const QUERY_KEY = {
  employee: "employees",
  department: "departments",
  position: "positions",
  contract: "contracts",
  employeeCountKey: "employee-count-by-base-salary",
  jobCountKey: "job-posting-count",
  applicantCountKey: "applicant-count",
  applicantCountByPositionKey: "applicant-count-by-position",
  leaveApplicationKey: "leave-applications-today",
  advanceCountKey: "advances-by-pay-period"
}

const pathList: Array<PathItem> = [
  {
    name: "",
    url: ""
  },
];

export default function Dashboard() {
  const { data: employeeData, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.employee],
    queryFn: () => employeeApiRequest.getList(),
    select: (data: ApiResponse<Employee[]>) => data.metadata || [], // Lấy toàn bộ dữ liệu nhân viên
  });
  const MasterCount = employeeData?.filter(employee => employee.level === "Thạc sĩ").length || 0;
  const BachelorCount = employeeData?.filter(employee => employee.level === "Đại học").length || 0;
  const DoctorateCount = employeeData?.filter(employee => employee.level === "Tiến sĩ").length || 0;
  const EngineerCount = employeeData?.filter(employee => employee.level === "Kỹ sư").length || 0;
  const maleCount = employeeData?.filter(employee => employee.gender === true).length || 0;
  const femaleCount = employeeData?.filter(employee => employee.gender === false).length || 0;
  const totalEmployees = employeeData?.length || 0;
  //range tuổi
  const under25Count = employeeData?.filter(employee => employee.age !== undefined && employee.age < 25).length || 0;
  const from25to34Count = employeeData?.filter(employee => employee.age !== undefined && employee.age >= 25 && employee.age <= 34).length || 0;
  const from35to44Count = employeeData?.filter(employee => employee.age !== undefined && employee.age >= 35 && employee.age <= 44).length || 0;
  const from45to54Count = employeeData?.filter(employee => employee.age !== undefined && employee.age >= 45 && employee.age <= 54).length || 0;
  const over55Count = employeeData?.filter(employee => employee.age !== undefined && employee.age > 55).length || 0;
  //range thâm niên 
  const under1YearCount = employeeData?.filter(employee => employee.tenure !== undefined && employee.tenure < 1).length;
  const from1to3YearsCount = employeeData?.filter(employee => employee.tenure !== undefined && employee.tenure >= 1 && employee.tenure <= 3).length;
  const from4to7YearsCount = employeeData?.filter(employee => employee.tenure !== undefined && employee.tenure >= 4 && employee.tenure <= 7).length;
  const from8to10YearsCount = employeeData?.filter(employee => employee.tenure !== undefined && employee.tenure >= 8 && employee.tenure <= 10).length;
  const over10YearsCount = employeeData?.filter(employee => employee.tenure !== undefined && employee.tenure > 10).length;

  const { data: departmentData } = useQuery({
    queryKey: [QUERY_KEY.department],
    queryFn: () => departmentApiRequest.getEmployeeCountByDepartment(),
    select: (data: ApiResponse<DepartmentUserCount[]>) => data.metadata || [],
  });
  const totalDepartment = departmentData?.length;

  const { data: contractData } = useQuery({
    queryKey: [QUERY_KEY.contract],
    queryFn: () => contractApiRequest.getList(),
    select: (data: ApiResponse<Contract[]>) => data.metadata || [],
  });
  const fullTimeCount = contractData?.filter(
    (contract) => contract.typeContract === TypeContract.Fulltime
  ).length;
  const partTimeCount = contractData?.filter(
    (contract) => contract.typeContract === TypeContract.Partime
  ).length;

  const chartData = [
    { gender: "male", count: maleCount, fill: "var(--color-male)" },
    { gender: "female", count: femaleCount, fill: "var(--color-female)" },
  ];
  const contractChartData = [
    { employeeType: "fulltime", countContractLabel: fullTimeCount, fill: "var(--color-fulltime)" },
    { employeeType: "partime", countContractLabel: partTimeCount, fill: "var(--color-partime)" },
  ];
  const levelChartData = [
    { level: "master", count: MasterCount, fill: "var(--color-master)" },
    { level: "bachelor", count: BachelorCount, fill: "var(--color-bachelor)" },
    { level: "doctorate", count: DoctorateCount, fill: "var(--color-doctorate)" },
    { level: "engineer", count: EngineerCount, fill: "var(--color-engineer)" },
  ]
  const ageRangeChartData = [
    { age: "<25", count: under25Count, fill: "hsl(var(--chart-1))" },
    { age: "25-34", count: from25to34Count, fill: "hsl(var(--chart-2))" },
    { age: "35-34", count: from35to44Count, fill: "hsl(var(--chart-3))" },
    { age: "45-54", count: from45to54Count, fill: "hsl(var(--chart-4))" },
    { age: ">55", count: over55Count, fill: "hsl(var(--chart-5))" },
  ]
  const tenureRangeChartData = [
    { year: "<1", count: under1YearCount, fill: "hsl(var(--chart-1))" },
    { year: "1-3", count: from1to3YearsCount, fill: "hsl(var(--chart-2))" },
    { year: "4-7", count: from4to7YearsCount, fill: "hsl(var(--chart-3))" },
    { year: "8-10", count: from8to10YearsCount, fill: "hsl(var(--chart-4))" },
    { year: ">10", count: over10YearsCount, fill: "hsl(var(--chart-5))" },
  ]
  const departmentChartData = departmentData?.map(department => ({
    id: department.id,
    name: department.name,
    count: department.employeeCount,   // Employee count
    fill: `var(--color-${department.id})`, // Dynamic color based on department ID
  }));

  const chartConfig = {
    count: {
      label: "Số nhân viên",
    },
    countContractLabel: {
      label: "Số hợp đồng",
    },
    male: {
      label: "Nam",
      color: "hsl(var(--chart-1))", // Đổi màu nếu cần
    },
    female: {
      label: "Nữ",
      color: "hsl(var(--chart-2))", // Đổi màu nếu cần
    },
    fulltime: {
      label: "Full-time",
      color: "hsl(var(--chart-3))",
    },
    partime: {
      label: "Part-time",
      color: "hsl(var(--chart-4))",
    },
    master: {
      label: "Thạc Sĩ",
      color: "hsl(var(--chart-1))",
    },
    doctorate: {
      label: "Tiến Sĩ",
      color: "hsl(var(--chart-2))",
    },
    engineer: {
      label: "Kỹ Sư",
      color: "hsl(var(--chart-3))",
    },
    bachelor: {
      label: "Cử Nhân",
      color: "hsl(var(--chart-4))",
    },
    applicant:{
      label: "Số đơn ứng tuyển"
    }
  } satisfies ChartConfig

  // Add dynamic department configurations
  const chartConfigDepartment: DynamicChartConfig= {    
    count: {
    label: "Số nhân viên",
  },}
  departmentData?.forEach(department => {
    chartConfigDepartment[department.id] = {
      label: department.name,
      color: `hsl(var(--chart-${department.id}))`, // Dynamic color based on department ID
    };
  });

  //Get contracts before expiring date 30 days
    //#region 
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    const [selectedDate, setSelectedDate] = useState<string>(formattedDate);
    const [startDate, setStartDate] = useState<string>(formattedDate);
    const [endDate, setEndDate] = useState<string>(formattedDate);
    const [change, setChange] = useState<number>(0)
    //#endregion

    //Employee count by base salary
    //#region 
    const { data: employeeCountData} = useQuery({
        queryKey: [QUERY_KEY.employeeCountKey],
        queryFn: () => dashboardApiRequest.getEmployeeCountByBaseSalary()
    })

  const chartApplicantPosition : DynamicChartConfig={
    count: {
      label: "Số đơn ứng tuyển: ",
      
    }}

    const employeeCountListData = employeeCountData?.metadata?.map(item => ({
        baseSalary: item.baseSalary,
        count: item.count,
        fill: `hsl(var(--chart-1))`
    })) || [];

    const { data: applicationByPositionData} = useQuery({
        queryKey: [QUERY_KEY.applicantCountByPositionKey],
        queryFn: () => dashboardApiRequest.getApplicantCountByPosition()
    })
    const applicantCountListData = applicationByPositionData?.metadata?.map(item => ({
        positionName: item.name,
        count: item.count,
        color: "hsl(var(--chart-1))"
    }))
    //#endregion

    //Count job posting, applicant, advances
    //#region 
    const { data: jobCountData} = useQuery({
        queryKey: [QUERY_KEY.jobCountKey],
        queryFn: () => dashboardApiRequest.getJobPostingCount()
    })

    const { data: applicantCountData} = useQuery({
        queryKey: [QUERY_KEY.applicantCountKey],
        queryFn: () => dashboardApiRequest.getApplicantCount()
    })

    const { data: advanceCountData, isLoading: advanceCountLoading } = useQuery({
        queryKey: [QUERY_KEY.advanceCountKey],
        queryFn: () => dashboardApiRequest.getAdvanceCountByPeriod(startDate, endDate)
    })
    //#endregion

    //leave application, expiring contracts
    //#region 
    const { data: leaveApplicationData, isLoading: leaveApplicationLoading } = useQuery({
        queryKey: [QUERY_KEY.leaveApplicationKey],
        queryFn: () => dashboardApiRequest.getLeaveApplicationsToday()
    });


    const { data: expiringContractData, isLoading: expiringContractLoading } = useQuery({
        queryKey: [QUERY_KEY.leaveApplicationKey, change],
        queryFn: () => dashboardApiRequest.getExpiringContracts(selectedDate)
    })
    //#endregion

    //get date change
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedDate(event.target.value);
  };

  const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(event.target.value);
  };

  const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.value);
  };

  return (
    <div className="space-y-5">
      <div className='flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Trang chủ</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      {/* đếm số lượng */}
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5"> 
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : isError ? (
          <p>Đã xảy ra lỗi khi tải dữ liệu</p>
        ) : (
          <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Số Lượng Nhân Viên
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{
                        totalEmployees ?? 0
                    }</div>
                    <p className="text-xs text-muted-foreground">
                        số nhân viên trong công ty
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Số Lượng Phòng Ban
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{
                        totalDepartment ?? 0
                    }</div>
                    <p className="text-xs text-muted-foreground">
                        số lượng phòng ban đang có
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Số Lượng Chức Vụ
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{
                        totalDepartment ?? 0
                    }</div>
                    <p className="text-xs text-muted-foreground">
                        số chức vụ hiện tại trong công ty
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Số Lượng Tin Tuyển Dụng
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{
                        jobCountData?.metadata ?? 0
                    }</div>
                    <p className="text-xs text-muted-foreground">
                        tổng số tin tuyển dụng đã đăng
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                    Số Lượng Đơn Ứng Tuyển
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{
                        applicantCountData?.metadata ?? 0
                    }</div>
                    <p className="text-xs text-muted-foreground">
                        tổng số đơn ứng tuyển đã nhận
                    </p>
                </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* thống kê */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Tỉ Lệ Nam-Nữ</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
                <Pie data={chartData} dataKey="count">
                  <LabelList
                    dataKey="gender"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Số Lượng Nhân Viên theo giới tính
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Hợp Đồng Full-time/Part-time</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="countContractLabel" hideLabel />}
                />
                <Pie data={contractChartData} dataKey="countContractLabel">
                  <LabelList
                    dataKey="employeeType"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
             Số Lượng Hợp Đồng theo loại Fulltime - Partime
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Thống Kê Trình Độ</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
                <Pie data={levelChartData} dataKey="count">
                  <LabelList
                    dataKey="level"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof chartConfig) =>
                      chartConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Số Lượng Nhân Viên Theo Trình Độ
            </div>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>
              Các Đơn Ứng Lương Kì Lương Này
            </CardTitle>
          </CardHeader>
          <br />
          <CardContent>
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label>
                  Ngày bắt đầu: <span></span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />
                </label>
                <label>
                  Ngày kết thúc:
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                  />
                </label>
              </div>
              {advanceCountLoading ? (
                <p>Loading...</p>
              ) : (
                <div>
                  <p>Số đơn ứng trước: {advanceCountData&&advanceCountData!.metadata}</p>
                </div>
              )}
              <button 
                onClick={() => setChange(change + 1)} 
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 w-full mt-4">
                Hiển thị thông tin
              </button>
            </div>               
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between space-x-4">
          <Card className="w-1/2">
              <CardHeader>
                  <CardTitle>Nhân Viên - Phòng Ban</CardTitle>
              </CardHeader>
              <CardContent>
                  <ChartContainer config={chartConfigDepartment}>
                      <BarChart
                          accessibilityLayer
                          data={departmentChartData}
                          layout="vertical"
                          margin={{
                              left: 200,
                          }}
                      >
                          <CartesianGrid horizontal={false} />
                          <YAxis
                              dataKey="name"
                              type="category"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              hide
                          />
                          <XAxis dataKey="count" type="number" hide />
                          <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent indicator="line" />}
                          />
                          <Bar
                              dataKey="count"
                              layout="vertical"
                              fill="var(--color-desktop)"
                              radius={4}
                          >
                              <LabelList
                                  width={300}
                                  dataKey="name"
                                  position="left"
                                  offset={8}
                                  className="fill-[--color-label]"
                                  fontSize={12}
                              />
                              <LabelList
                                  dataKey="count"
                                  position="right"
                                  offset={8}
                                  className="fill-foreground"
                                  fontSize={12}
                              />
                          </Bar>
                      </BarChart>
                  </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="leading-none text-muted-foreground">
                      Hiển Thị Số Lượng Nhân Viên Theo Phòng Ban
                  </div>
              </CardFooter>
          </Card>

          <Card className="w-1/2">
              <CardHeader>
                  <CardTitle>Thống kê Đơn Ứng Tuyển Theo Vị Trí</CardTitle>
              </CardHeader>
              <CardContent>
                  <ChartContainer config={chartApplicantPosition}>
                      <BarChart
                          accessibilityLayer
                          data={applicantCountListData}
                          layout="vertical"
                          margin={{
                              left: -20,
                          }}
                      >
                          <XAxis type="number" dataKey="count" hide />
                          <YAxis
                              dataKey="positionName"
                              type="category"
                              tickLine={false}
                              tickMargin={10}
                              axisLine={false}
                              tickFormatter={(value) => value.slice(0, 40)}
                              width={200}
                          />
                          <ChartTooltip
                              cursor={false}
                              content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar 
                              dataKey="count" 
                              fill="hsl(var(--chart-1))" 
                              radius={5} 
                              barSize={20}
                          >
                              <LabelList
                                  dataKey="count"
                                  position="right"
                                  offset={8}
                                  className="fill-foreground"
                                  fontSize={12}
                              />
                          </Bar>
                      </BarChart>
                  </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col items-start gap-2 text-sm">
                  <div className="leading-none text-muted-foreground">
                      Hiển Thị Các Vị Trí Được Ứng Tuyển Nhiều Nhất
                  </div>
              </CardFooter>
          </Card>
      </div>
      
      <div className="flex flex-wrap gap-4">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Nhân Viên - Range Tuổi</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={ageRangeChartData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="age"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 6)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Hiển Thị Số Lượng Nhân Viên Theo Range Tuổi
            </div>
          </CardFooter>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Nhân Viên - Thâm Niên (Năm)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={tenureRangeChartData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="year"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 6)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="var(--color-desktop)" radius={8}>
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Hiển thị các số lượng các nhân viên theo các thâm niên.
            </div>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
            <CardHeader>
                <CardTitle>Số Lượng Nhân Viên Theo Mức Lương Cơ Bản</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer  config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={employeeCountListData}
                        margin={{
                            top: 20,
                        }}
                        height={10}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="baseSalary"
                            tickLine={false}
                            tickMargin={5}
                            axisLine={false}
                            tickFormatter={(value) => String(value).slice(0, 9)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={8} barSize={40}>
                            <LabelList
                                position="top"
                                offset={12}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    Hiển Thị Số Lượng Nhân Viên Theo Các Mức Lương Cơ Bản
                </div>
            </CardFooter>
        </Card>
      </div>

      <div>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>
                      Danh Sách Các Đơn Xin Nghỉ Trong Ngày
                  </CardTitle>
              </CardHeader>
              <Table>
                  <TableHeader>
                      <TableRow>
                      <TableHead className="w-[100px]">Trạng thái</TableHead>
                      <TableHead>Mã nhân viên</TableHead>
                      <TableHead className="text-center">Lí do nghỉ</TableHead>
                      <TableHead className="text-center">Hồi đáp</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {
                          leaveApplicationLoading ? <></> :
                          leaveApplicationData&&leaveApplicationData!.metadata?.map((item, index) => {
                                  return <TableRow key={index}>
                                  <TableCell className="font-medium">{item.statusLeave}</TableCell>
                                  <TableCell className="font-medium">{item.employeeId}</TableCell>
                                  <TableCell className="font-medium">{item.description}</TableCell>
                                  <TableCell className="font-medium">{item.replyMessage}</TableCell>
                                  </TableRow>
                              })
                      }
                  </TableBody>
              </Table>
          </Card>
      </div>
      
      <div>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle>
                      Danh sách hợp đồng sắp hết hạn
                  </CardTitle>
              </CardHeader>
              <CardContent>
                  <label>
                      Lấy ngày hết hạn hợp đồng: <span></span>
                      <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                      />
                  </label>
                  <span style={{ margin: '0 20px' }}></span>
                  <Button onClick={() => setChange(change + 1)}>Lấy Danh Sách</Button>
              </CardContent>
              
              <Table>
                  <TableCaption>Danh Sách Hợp Đồng Trước Ngày Hết Hạn 30 Ngày</TableCaption>
                  <TableHeader>
                      <TableRow>
                      <TableHead className="w-[150px]">Mã Hợp Đồng</TableHead>
                      <TableHead>Tên Nhân Viên</TableHead>
                      <TableHead className="text-center">Ngày Bắt Đầu</TableHead>
                      <TableHead className="text-center">Ngày Két Thúc</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {
                          expiringContractLoading ? <></> :
                          expiringContractData&&expiringContractData!.metadata?.map((item, index) => {
                              return <TableRow key={index}>
                              <TableCell >{item.id}</TableCell>
                              <TableCell>{item.name}</TableCell>
                              <TableCell>{item.startDate}</TableCell>
                              <TableCell >{item.endDate}</TableCell>
                              </TableRow>
                          })
                      }
                  </TableBody>
                  </Table>

          </Card>
          
      </div>
    </div>
  );
};