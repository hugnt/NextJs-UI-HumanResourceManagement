"use client"
import AppBreadcrumb, { PathItem } from '@/components/custom/_breadcrumb';
import React, { useState } from 'react'
import { Label } from '@/components/ui/label';
import DatePickerCustom from '@/components/custom/_date-picker';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from '@/components/ui/checkbox';
import { toaster } from '@/components/custom/_toast';
import { useMutation } from '@tanstack/react-query';
import workShiftApiRequest from '@/apis/work-shift.api';
import { StatusCalendar, UserCalendarInsert, WorkPlanInsert } from '@/data/schema/work-shift.schema';
import { ShiftTime } from '@/data/schema/calendar.schema';
import { Button } from '@/components/custom/button';
import { handleErrorApi, handleSuccessApi } from '@/lib/utils';
const pathList: Array<PathItem> = [
  {
    name: "TimeKeeping",
    url: "/time-keeping"
  },
  {
    name: "Register Shift",
    url: "/time-keeping/work-shift"
  },
];
const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
export type WorkShift = {
  day: string,
  isCheckMorning: boolean,
  isCheckAfternoon: boolean,
  isCheckEvening: boolean
}
export const addDays = (date: Date, dayAdds: number): Date => {
  const newDate = new Date(date) // Create a copy of the date to avoid mutating the original
  newDate.setDate(newDate.getDate() + dayAdds) // Add day
  return newDate
}
export const extractDateInfo = (date: Date) => {
  const day = date.getDate(); // Day of the month (1-31)
  const month = date.getMonth() + 1; // Month (0-11), so we add 1
  const year = date.getFullYear(); // Full year (e.g., 2024)
  return { day, month, year };
}
export const getDayOfWeek = (date: Date): string => {
  return daysOfWeek[date!.getDay()];
}
export default function page() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [calendars, setCalendars] = useState<WorkShift[]>([])


  const updateIsCheck = (index: number, shiftType: 'isCheckMorning' | 'isCheckAfternoon' | 'isCheckEvening', value: boolean) => {
    setCalendars(prevCalendars => {
      const updatedCalendars = [...prevCalendars];
      const updatedShift = { ...updatedCalendars[index] };
      updatedShift[shiftType] = value;
      updatedCalendars[index] = updatedShift;
      return updatedCalendars;
    });
  };
  const generateUserCalendarInserts = (): UserCalendarInsert[] => {
    const result: UserCalendarInsert[] = [];

    calendars.forEach((calendar) => {
      // Kiểm tra nếu isCheckMorning là true thì thêm vào
      if (calendar.isCheckMorning) {
        result.push({
          presentShift: calendar.day.split(" - ")[1].split("/").reverse().join("-"),  // Lấy giá trị của day
          shiftTime: ShiftTime.Morning,        // ShiftTime là Morning
        });
      }
      if (calendar.isCheckAfternoon) {
        result.push({
          presentShift: calendar.day.split(" - ")[1].split("/").reverse().join("-"),
          shiftTime: ShiftTime.Afternoon,
        });
      }
      if (calendar.isCheckEvening) {
        result.push({
          presentShift: calendar.day.split(" - ")[1].split("/").reverse().join("-"),
          shiftTime: ShiftTime.Evening,
        });
      }
    });

    return result;
  };
  const showCalendar = () => {
    let start = startDate
    let end = endDate
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    let stringFalse = "";
    if (start == null || end == null) {
      stringFalse = "Start date and End date must not null. "
    }
    else if (start <= tomorrow) {
      stringFalse = "Start date must be at least 1 day after today. "
    }
    else if (end <= start) {
      stringFalse = "End date must be greater than start date."
    }
    if (stringFalse != "") {
      toaster.error({
        title: 'Error',
        message: stringFalse,
      }, {
        position: "bottom-right",
        autoClose: 2000
      })
      return;
    }
    const diffTime = Math.abs(end!.getTime() - start!.getTime()); // Difference in milliseconds
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    let listCalendar: WorkShift[] = []
    for (let i = 0; i <= diffDays; i++) {
      let dayOfWeek = addDays(start!, i)
      let { day, month, year } = extractDateInfo(dayOfWeek);
      let workShift: WorkShift = {
        day: getDayOfWeek(dayOfWeek) + " - " + `${day}/${month}/${year}`,
        isCheckMorning: false,
        isCheckAfternoon: false,
        isCheckEvening: false
      }
      listCalendar.push(workShift)
    }
    setCalendars(listCalendar)
  }
  const formatDateToLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  const { mutate, isPending } = useMutation({
    mutationKey: ["register-shift"],
    mutationFn: () => {
      let workPlanInsert: WorkPlanInsert = {
        timeStart: formatDateToLocal(startDate!),
        timeEnd: formatDateToLocal(endDate!),
        statusCalendar: StatusCalendar.Submit,
        dayWorks: generateUserCalendarInserts()
      }
      console.log(workPlanInsert)
      return workShiftApiRequest.registerShift(workPlanInsert)
    },
    onSuccess(data) {
      if (data.isSuccess) {
        handleSuccessApi({ message: "Register Shift Successfully!" })
        setStartDate(undefined)
        setEndDate(undefined)
        setCalendars([])
      } else {
        handleErrorApi({ error: data.message })
      }
    },
  })

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Register Shift</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>
      <div id="date-range-picker" date-rangepicker className="flex items-center w-full mt-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Start Date</Label>
          <DatePickerCustom date={startDate} setDate={setStartDate} />
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">End Date</Label>
          <DatePickerCustom date={endDate} setDate={setEndDate} />
        </div>
        <div className="grid max-w-sm items-center gap-1.5">
          <Label htmlFor="email"></Label>
          <Button onClick={() => showCalendar()} variant="default" className='mt-3'>Show calendar</Button>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0 mb-6'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Morning</TableHead>
              <TableHead>Afternoon</TableHead>
              <TableHead>Evening</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {calendars.map((calendar, index) => (
              <TableRow key={index}>
                <TableCell className="h-[70px]">{calendar.day}</TableCell>
                <TableCell className="h-[70px]">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms"
                      checked={calendar.isCheckMorning}
                      onCheckedChange={() => updateIsCheck(index, 'isCheckMorning', !calendar.isCheckMorning)} />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Morning Shift
                    </label>
                  </div>
                </TableCell>
                <TableCell className="h-[70px]">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms"
                      checked={calendar.isCheckAfternoon}
                      onCheckedChange={() => updateIsCheck(index, 'isCheckAfternoon', !calendar.isCheckAfternoon)} />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Afternoon Shift
                    </label>
                  </div>
                </TableCell>
                <TableCell className="h-[70px]">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms"
                      checked={calendar.isCheckEvening}
                      onCheckedChange={() => updateIsCheck(index, 'isCheckEvening', !calendar.isCheckEvening)} />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Evening Shift
                    </label>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {calendars.length != 0 ?
          <div className='flex item-center justify-end mt-6 ml-6'>
            <Button loading={isPending} variant="default" className='mt-3' onClick={() => mutate()}>Submit</Button>
          </div>
          :
          <></>}
      </div>
    </>
  )
}
