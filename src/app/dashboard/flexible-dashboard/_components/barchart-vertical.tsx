"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
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
import { labelResult } from "./form-crud"
const chartData = [
    { label: "January", value: 186 },
    { label: "February", value: 305 },
    { label: "March", value: 237 },
    { label: "April", value: 73 },
    { label: "May", value: 209 },
    { label: "June", value: 214 },
]

const chartConfig = {
    value: {
        label: "Value",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

type Props = {
    data: labelResult[],
    title: string,
    first_description: string,
    second_description: string
}
export function BarChartVertical({ data, title, first_description, second_description }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{first_description}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart accessibilityLayer data={data}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="label"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 5)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="value" fill="var(--color-desktop)" radius={8} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none text-muted-foreground">
                    {second_description}
                </div>
            </CardFooter>
        </Card>
    )
}
