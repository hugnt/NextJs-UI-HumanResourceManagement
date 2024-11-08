"use client";
import dashboardApiRequest from "@/apis/dashboard.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useQuery } from "@tanstack/react-query";
import { TrendingUp } from "lucide-react";
import React, { useState } from "react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts";
import { DataTable } from "./data-table"
import { leaveApplication, columns } from "./columns"
import { start } from "repl";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  

export const description = ""

const chartConfig = {
    desktop: {
        label: "Count",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig


const QUERY_KEY = {
    employeeCountKey: "employee-count-by-base-salary",
    jobCountKey: "job-posting-count",
    applicantCountKey: "applicant-count",
    applicantCountByPositionKey: "applicant-count-by-position",
    leaveApplicationKey: "leave-applications-today",
    advanceCountKey: "advances-by-pay-period"
}
export default function DashboardPage() {
    
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
    const { data: employeeCountData, isLoading: employeeCountLoading } = useQuery({
        queryKey: [QUERY_KEY.employeeCountKey],
        queryFn: () => dashboardApiRequest.getEmployeeCountByBaseSalary()
    })

    const employeeCountListData = employeeCountData?.metadata?.map(item => ({
        baseSalary: item.baseSalary,
        count: item.count,
    })) || [];

    const { data: applicationByPositionData, isLoading: applicationByPositionLoading } = useQuery({
        queryKey: [QUERY_KEY.applicantCountByPositionKey],
        queryFn: () => dashboardApiRequest.getApplicantCountByPosition()
    })
    const applicantCountListData = applicationByPositionData?.metadata?.map(item => ({
        positionName: item.name,
        count: item.count,
    }))
    //#endregion

    //Count job posting, applicant, advances
    //#region 
    const { data: jobCountData, isLoading: jobCountLoading } = useQuery({
        queryKey: [QUERY_KEY.jobCountKey],
        queryFn: () => dashboardApiRequest.getJobPostingCount()
    })

    const { data: applicantCountData, isLoading: applicantCountLoading } = useQuery({
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
    //#region 
    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEndDate(event.target.value);
    };
    //#endregion

    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Jb posting count */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Job Posting Count
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{
                            jobCountLoading ? <></> :
                                <div>{jobCountData?.metadata!}</div>
                        }</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                {/* Applicant count */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Applicant Count
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{
                            applicantCountLoading ? <></> :
                                <div>{applicantCountData?.metadata!}</div>
                        }</div>
                        <p className="text-xs text-muted-foreground">
                            +20.1% from last month
                        </p>
                    </CardContent>
                </Card>
                {/* Advance count */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Advances Count by PayPeriod
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <div style={{ marginBottom: '20px' }}>
                                <label>
                                    Start: <span></span>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={handleStartDateChange}
                                    />
                                </label>
                                <span style={{ margin: '0 20px' }}></span>
                                <label>
                                    End: <span></span>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={handleEndDateChange}
                                    />
                                </label>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => setChange(change + 1)} 
                                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                                    Get Advance Count
                                </button>
                                {advanceCountLoading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div>
                                        <p>Advance Count: {advanceCountData!.metadata}</p>
                                    </div>
                                )}
                            </div>
                        </div>               
                    </CardContent>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Bar Chart - Employee Count By Base Salary</CardTitle>
                        <CardDescription>June - December 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
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
                                    tickFormatter={(value) => String(value).slice(0, 5)}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="count" fill="var(--color-desktop)" radius={8} barSize={40}>
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
                        <div className="flex gap-2 font-medium leading-none">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                            Showing total visitors for the last 6 months
                        </div>
                    </CardFooter>
                </Card>
            </div>

            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Bar Chart - Horizontal</CardTitle>
                        <CardDescription>January - June 2024</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                        <BarChart
                            accessibilityLayer
                            data={applicantCountListData}
                            layout="vertical"
                            margin={{
                            left: -20,
                            }}
                        >
                            <XAxis type="number" dataKey="desktop" hide />
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
                            <Bar dataKey="count" fill="var(--color-desktop)" radius={5} />
                        </BarChart>
                        </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-2 text-sm">
                        <div className="flex gap-2 font-medium leading-none">
                        Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                        </div>
                        <div className="leading-none text-muted-foreground">
                        Showing total visitors for the last 6 months
                        </div>
                    </CardFooter>
                    </Card>
                
            </div>

            <div>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle>
                            Leave Applications today
                        </CardTitle>
                    </CardHeader>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Status Leave</TableHead>
                            <TableHead>EmployeeId</TableHead>
                            <TableHead className="text-center">Desc</TableHead>
                            <TableHead className="text-center">Reply</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                leaveApplicationLoading ? <></> :
                                leaveApplicationData!.metadata?.map((item, index) => {
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
                            Contract Expiring before date
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <label>
                            Get expiring date:  
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                            />
                        </label>
                        <span style={{ margin: '0 20px' }}></span>
                        <Button onClick={() => setChange(change + 1)}>Get Contracts</Button>
                    </CardContent>
                    
                    <Table>
                        <TableCaption>Contracts expiring</TableCaption>
                        <TableHeader>
                            <TableRow>
                            <TableHead className="w-[100px]">Id</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="text-center">StartDate</TableHead>
                            <TableHead className="text-center">EndDate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                expiringContractLoading ? <></> :
                                expiringContractData!.metadata?.map((item, index) => {
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

    )

}
