/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import departmentApiRequest from "@/apis/department.api";
import employeeApiRequest from "@/apis/employee.api";
import positionApiRequest from "@/apis/position.api";
import contractApiRequest from "@/apis/contract.api";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { useQuery } from "@tanstack/react-query";
import QuantityCard from "@/components/QuantityCard";
import { Employee } from "@/data/schema/employee.schema";
import { ApiResponse } from "@/data/type/response.type";
import { DepartmentUserCount } from "@/data/schema/department.schema";
import { Position } from "@/data/schema/position.schema";
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
  contract: "contracts"
}

const pathList: Array<PathItem> = [
  {
    name: "",
    url: ""
  },
];

export default function SampleList() {
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

  const { data: positionData } = useQuery({
    queryKey: [QUERY_KEY.position],
    queryFn: () => positionApiRequest.getList(),
    select: (data: ApiResponse<Position[]>) => data.metadata?.length ?? 0,
  });

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
    { age: "<25", count: under25Count, fill: "var(--color-under25Count)" },
    { age: "25-34", count: from25to34Count, fill: "var(--color-from25to34Count)" },
    { age: "35-34", count: from35to44Count, fill: "var(--color-from35to44Count)" },
    { age: "45-54", count: from45to54Count, fill: "var(--color-from45to54Count)" },
    { age: ">55", count: over55Count, fill: "var(--color-over55Count)" },
  ]
  const tenureRangeChartData = [
    { year: "<1", count: under1YearCount, fill: "var(--color-under1YearCount)" },
    { year: "1-3", count: from1to3YearsCount, fill: "var(--color-from1to3YearsCount)" },
    { year: "4-7", count: from4to7YearsCount, fill: "var(--color-from4to7YearsCount)" },
    { year: "8-10", count: from8to10YearsCount, fill: "var(--color-from8to10YearsCount)" },
    { year: ">10", count: over10YearsCount, fill: "var(--color-over10YearsCount)" },
  ]
  const departmentChartData = departmentData?.map(department => ({
    id: department.id,
    name: department.name, // Use department name for the chart label
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

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Dash Board</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
        {isLoading ? (
          <p>Đang tải dữ liệu...</p>
        ) : isError ? (
          <p>Đã xảy ra lỗi khi tải dữ liệu</p>
        ) : (
          <>
            <QuantityCard title="Số Lượng Nhân Viên" quantity={totalEmployees ?? 0} />
            <QuantityCard title="Số Lượng Phòng Ban" quantity={totalDepartment ?? 0} />
            <QuantityCard title="Số Lượng Chức Vụ" quantity={positionData ?? 0} />
          </>
        )}
        {/* Thêm các thẻ thống kê khác tương tự */}
      </div>

      <div className="flex gap-4">
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
      </div>

      <div>
      {/* <Card className="flex flex-col">
          <CardHeader className="items-center pb-0">
            <CardTitle>Department Employee Count</CardTitle>
            <CardDescription>Các phòng ban trống sẽ vẫn hiển thị</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              config={chartConfigDepartment}
              className="mx-auto aspect-square max-h-[500px] [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="count" hideLabel />}
                />
                <Pie data={departmentChartData} dataKey="count">
                  <LabelList
                    dataKey="id"
                    className="fill-background"
                    stroke="none"
                    fontSize={10}
                    formatter={(value: keyof typeof chartConfigDepartment) =>
                      chartConfigDepartment[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Showing total employee counts by department
            </div>
          </CardFooter>
      </Card> */}
      </div>

      <div>
        <Card>
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
                  left: +200,
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

        <Card>
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

        <Card>
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
    </>
  );
};