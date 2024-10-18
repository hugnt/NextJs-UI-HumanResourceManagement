"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = {
    date: Date | undefined,
    setDate?: (date: Date | undefined) => void,
    disable?: boolean
}

export default function DatePickerCustom({ date, setDate, disable }: Props) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    disabled={disable == null ? false : disable}
                    mode="single"
                    selected={date}
                    onSelect={setDate ? (newDate) => setDate(newDate) : undefined} // Use onSelect only if setDate is provided
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    )
}
