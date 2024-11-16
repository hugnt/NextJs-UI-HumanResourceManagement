import { z } from "zod"

export type PageFlexibleDashboardResult = {
    id: number,
    title: string,
    url: string
}

export type ChartResult = {
    pageFlexibleDashboardId: number,
    data: string,
    title: string,
    firstDescription: string
    secondDescription: string,
    size: number
    propertyName: string
    chartType: ChartType
}
export enum ChartType {
    BarChartHorizontal = 1,
    BarChartVertical = 2,
    PieChart = 3,
    RadialChart = 4
}

export const chartSchema = z.object({
    pageFlexibleDashboardId: z.coerce.number().optional(),
    data: z.string().min(0).max(255).optional(),
    title: z.string().min(0).max(255).optional(),
    firstDescription: z.string().min(0).max(255).optional(),
    secondDescription: z.string().min(0).max(255).optional(),
    size: z.coerce.number().optional(),
    propertyName: z.string().min(0).max(255).optional(),
    chartType: z.nativeEnum(ChartType).optional()
});

export type Chart = z.infer<typeof chartSchema>;
export const chartDefault: Chart = {

};

