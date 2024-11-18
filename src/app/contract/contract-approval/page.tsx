/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import contractApiRequest from "@/apis/contract.api";
import FormCRUD from "@/app/contract/contract-list/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CRUD_MODE } from "@/data/const";
import { Contract, ContractStatus, SignStatus, TypeContract } from "@/data/schema/contract.schema";
import { handleSuccessApi } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { EyeIcon } from "lucide-react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

const pathList: Array<PathItem> = [
  {
    name: "Contract",
    url: ""
  },
  {
    name: "Contract Approval",
    url: "/Contract/Contract Approval"
  },
];

//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'name',
    title: 'Name',
    options: [
      {
        label: 'Start with W',
        value: 'W'
      },
      {
        label: 'Start with H',
        value: 'H'
      }
    ],
  },
];

//react query key
const QUERY_KEY = {
  keyList: "contract-approval",
}

export default function ContractApprove() {
  const [detail, setDetail] = useState<Contract>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);
  //const [contractTypes, setContractTypes] = useState<ContractType[]>([]);

  const queryClient = useQueryClient();
  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => contractApiRequest.getList(),
  });

  // Function to get full-time/part-time status
  const getTypeContract = (status: TypeContract) => {
    return status === TypeContract.Fulltime ? "FullTime" : "PartTime"; // Map to human-readable values
  };

  // Function to get sign status
  const getSignStatus = (status: SignStatus) => {
    return status === SignStatus.Signed ? "Signed" : "Not Signed";
  };

  // Function to get gender
  const getGender = (status: boolean) => {
    return status === true ? "Male" : "Female"; // Map to human-readable values
  };

  // Function to get contract status
  const getContractStatus = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.Expired:
        return "Expired";
      case ContractStatus.Valid:
        return "Valid";
      case ContractStatus.Terminated:
        return "Terminated";
      default:
        return "Pending";
    }
  };

  const updateDataStatus = useMutation({
    mutationFn: ({ id, status }: { id: number, status: number }) => contractApiRequest.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated status Successfully!" });
      setOpenCRUD(false);
    }
  });

  const columnsDef: ColumnDef<Contract>[] = [
    {
      accessorKey: 'name', // Employee Level
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tên Nhân Viên' />
      ),
      cell: ({ row }) => <div className="w-[180px]">{row.getValue('name')}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'contractTypeName', // Use contractTypeId to access the FK
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Loại Hợp Đồng' />
      ),
      cell: ({ row }) => (
        <div className='w-[200px]'>{row.getValue('contractTypeName')}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'startDate', // Add other columns as necessary
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Start Date' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('startDate')}</div>,
    //   enableHiding: true,
    // },
    {
      accessorKey: 'endDate', // Add other columns as necessary
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày Hết Hạn' />
      ),
      cell: ({ row }) => <div>{new Intl.DateTimeFormat('vi-VN').format(new Date(row.getValue('endDate')))}</div>,
      enableHiding: true,
    },
    {
      accessorKey: 'employeeSignStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trạng thái ký NV' />
      ),
      cell: ({ row }) => (
        <div className='w-[150px]'>{getSignStatus(row.getValue('employeeSignStatus'))}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'companySignStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trạng thái ký CT' />
      ),
      cell: ({ row }) => (
        <div className='w-[150px]'>{getSignStatus(row.getValue('companySignStatus'))}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'contractStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trạng Thái' />
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">{getContractStatus(row.getValue('contractStatus'))}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'typeContract',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Loại Nhân Viên' />
      ),
      cell: ({ row }) => (
        <div className="w-[100px]">{getTypeContract(row.getValue('typeContract'))}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'positionName', // Position Name
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Chức Vụ' />
      ),
      cell: ({ row }) => <div className="w-[100px]">{row.getValue('positionName')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'departmentName', // Department Name
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Phòng Ban' />
      ),
      cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'baseSalary', // Base Salary
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Lương Cơ Bản' />
      ),
      cell: ({ row }) => <div>{row.getValue('baseSalary')}</div>,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'wageDaily', // Daily Wage
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Daily Wage' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('wageDaily')}</div>,
    //   enableHiding: true,
    // },
    {
      accessorKey: 'wageHourly', // Hourly Wage
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Số công/giờ' />
      ),
      cell: ({ row }) => <div>{row.getValue('wageHourly')}</div>,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'requiredDays', // Required Days
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Required Days' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('requiredDays')}</div>,
    //   enableHiding: true,
    // },
    {
      accessorKey: 'requiredHours', // Required Hours
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Số giờ quy định' />
      ),
      cell: ({ row }) => <div>{row.getValue('requiredHours')}</div>,
      enableHiding: true,
    },
  ];
  const columnsDefPendingAdmin: ColumnDef<Contract>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <div className="flex space-x-1">
        <Button onClick={() => handleUpdateStatus(row, 5)} className="bg-green-600 h-[1.5rem]" size={"sm"}>
          <FaCheck className='mr-2 h-3 w-3' />
          Duyệt
        </Button>
        <Button onClick={() => handleUpdateStatus(row, 6)} className="bg-red-500 h-[1.5rem]" size={"sm"}>
          <MdOutlineCancel className='mr-1 h-4 w-4' />
          Từ chối
        </Button>
        <Button onClick={() => handleView(row)} className="h-[1.5rem]" size={"sm"}>
          <EyeIcon className='mr-1 h-4 w-4' />
          Xem
        </Button>
      </div>,
    }
  ];
  const columnsDefConfirm: ColumnDef<Contract>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <div className="flex space-x-1">
        <Button onClick={() => handleView(row)} className="h-[1.5rem]" size={"sm"}>
          <EyeIcon className='mr-1 h-4 w-4' />
          Xem
        </Button>
        <Button onClick={() => handleUpdateStatus(row, 4)} className="bg-yellow-500 h-[1.5rem]" size={"sm"}>
          <MdOutlineCancel className='mr-1 h-4 w-4' />
          Hủy
        </Button>
      </div>
    }
  ];
  const columnsDefRefused: ColumnDef<Contract>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) =>
        // <Button className="bg-red-500 h-[1.5rem]" onClick={() => handleDelete(row)} size={"sm"}>
        //   <FaRegTrashAlt className='mr-1 h-4 w-4' />
        //   Xóa
        // </Button>
        <Button onClick={() => handleView(row)} className="h-[1.5rem]" size={"sm"}>
          <EyeIcon className='mr-1 h-4 w-4' />
          Xem
        </Button>
    }
  ];
  //ACTION HANDLER
  const handleView = async (row: Row<Contract>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    selectedData.allowanceIds = selectedData.allowanceResults?.map(x => x.id)
      .filter((id): id is number => id !== undefined) ?? [];
    selectedData.insuranceIds = selectedData.insuranceResults?.map(x => x.id)
      .filter((id): id is number => id !== undefined) ?? [];
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleUpdateStatus = (row: Row<Contract>, status: number) => {
    const id = row.original.id;
    if (id) updateDataStatus.mutate({ id, status });
  };

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Contract List</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <Tabs defaultValue="pending" className="">
          <TabsList>
            <TabsTrigger value="pending">
              Chờ duyệt
              <Badge className="ms-1 py-0 px-2 bg-yellow-500">{listDataQuery.data?.metadata?.filter(x => x.contractStatus == ContractStatus.Pending)?.length ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Đã duyệt
              <Badge className="ms-1 py-0 px-2">{listDataQuery.data?.metadata?.filter(x => x.contractStatus == ContractStatus.Approved)?.length ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="refused">
              Từ chối
              <Badge className="ms-1 py-0 px-2 bg-red-500">{listDataQuery.data?.metadata?.filter(x => x.contractStatus == ContractStatus.Declined)?.length ?? 0}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <DataTable data={listDataQuery.data?.metadata?.filter(x => x.contractStatus == ContractStatus.Pending) ?? []} columns={columnsDefPendingAdmin} filters={dataFilter} searchField="name" />
          </TabsContent>
          <TabsContent value="approved">
            <DataTable data={listDataQuery.data?.metadata?.filter(x => x.contractStatus == ContractStatus.Approved) ?? []} columns={columnsDefConfirm} filters={dataFilter} searchField="name" />
          </TabsContent>
          <TabsContent value="refused">
            <DataTable data={listDataQuery.data?.metadata?.filter(x => x.contractStatus == ContractStatus.Declined) ?? []} columns={columnsDefRefused} filters={dataFilter} searchField="name" />
          </TabsContent>
        </Tabs>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
