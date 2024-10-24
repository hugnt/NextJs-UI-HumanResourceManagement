"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerRangeProps extends React.HTMLAttributes<HTMLDivElement> {
    dateRange?: DateRange;
    setDateRage?: (dateRange?: DateRange)=>void;
}

export function DatePickerRange({className, dateRange = {
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  },setDateRage}: DatePickerRangeProps) {
 
  //const [date, setDate] = React.useState<DateRange | undefined>(dateRange)
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              `justify-start text-left font-normal w-[150px] lg:w-[250px] h-8`,
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={setDateRage}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
