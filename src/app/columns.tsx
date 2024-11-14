"use client"

import { ColumnDef } from "@tanstack/react-table"

export type leaveApplication = {
  employeeId: number;
  statusLeave: number;
  description?: string; 
  timeLeave: number;
  replyMessage?: string;
}

export const columns: ColumnDef<leaveApplication>[] = [
    {
      accessorKey: "employeeId", 
      header: "Employee ID",     
    },
    {
      accessorKey: "statusLeave",
      header: "Leave Status",
      cell: ({ getValue }) => {
        const status = getValue();
        switch (status) {
          case 1:
            return 'Draft';
          case 2:
            return 'Approved';
          case 3:
            return 'Refused';
          default:
            return 'Unknown';
        }}
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "timeLeave",
      header: "Time Leave",
      
    },
    {
      accessorKey: "replyMessage", 
      header: "Reply Message",     
    },
  ]
