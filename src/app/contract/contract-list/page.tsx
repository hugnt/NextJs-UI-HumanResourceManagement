/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import contractApiRequest from "@/apis/contract.api";
import FormCRUD from "@/app/contract/contract-list/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { Contract, contractDefault, ContractStatus, SignStatus, TypeContract } from "@/data/schema/contract.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Contract",
    url: ""
  },
  {
    name: "Contract List",
    url: "/Contract/ContractList"
  },
];

//Filter by "Signed" : "Not Signed";
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'companySignStatus',
    title: 'Trạng thái duyệt',
    options: [
      {
        label: 'Chờ duyệt',
        value: 'Not Signed'
      },
      {
        label: 'Đã duyệt',
        value: 'Signed'
      }
    ],
  },
];

//react query key
const QUERY_KEY = {
  keyList: "contracts",
}

export default function ContractList() {
  const [detail, setDetail] = useState<Contract>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);
  //const [contractTypes, setContractTypes] = useState<ContractType[]>([]);

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
      cell: ({ row }) => <div className="min-w-[150px]">{row.getValue('positionName')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'departmentName', // Department Name
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Phòng Ban' />
      ),
      cell: ({ row }) => <div className="min-w-[150px]">{row.getValue('departmentName')}</div>,
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
    {
      accessorKey: 'allowanceResults', // Array of allowances
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Trợ Cấp' />
      ),
      cell: ({ row }) => {
        const allowanceResults = row.getValue('allowanceResults') as {
          id?: number;
          name?: string;
          amount?: number;
          terms?: string;
        }[] || []; // Fallback to an empty array if not defined

        return allowanceResults.length > 0 ? (
          <div className="w-[150px]">
            {allowanceResults.map((allowance, index) => (
              <div key={index} className="mb-2">
                <div>{allowance.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No allowances</div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'insuranceResults', // Array of insurances
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Bảo Hiểm' />
      ),
      cell: ({ row }) => {
        const insuranceResults = row.getValue('insuranceResults') as {
          id?: number;
          name?: string;
          percentCompany?: number;
          percentEmployee?: number;
        }[] || []; // Fallback to an empty array if not defined

        return insuranceResults.length > 0 ? (
          <div className="w-[100px]">
            {insuranceResults.map((insurance, index) => (
              <div key={index} className="mb-2">
                <div>{insurance.name}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No insurances</div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'level', // Employee Level
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Level' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('level')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'major', // Employee Major
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Major' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('major')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'nationalID', // National ID
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='National ID' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('nationalID')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'nationalStartDate', // National ID Start Date
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='National ID Start Date' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('nationalStartDate')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'address', // Employee Address
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Address' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('address')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'countrySide', // Employee Country Side
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Country Side' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('countrySide')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'gender', // Employee Gender
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Gender' />
    //   ),
    //   cell: ({ row }) => <div>{getGender(row.getValue('gender'))}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'dateOfBirth', // Employee Date of Birth
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='Date of Birth' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('dateOfBirth')}</div>,
    //   enableHiding: true,
    // },

    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Hành Động' />
      ),
      cell: ({ row }) => <div className="w-[100px]"><DataTableRowActions row={row}
        handleView={() => handleView(row)}
        handleEdit={() => handleEdit(row)}
        handleDelete={() => handleDelete(row)} /></div>,
    },
  ];

  //ACTION HANDLER
  const handleAddNew = () => {
    setDetail(contractDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

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

  const handleEdit = (row: Row<Contract>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    selectedData.allowanceIds = selectedData.allowanceResults?.map(x => x.id)
      .filter((id): id is number => id !== undefined) ?? [];
    selectedData.insuranceIds = selectedData.insuranceResults?.map(x => x.id)
      .filter((id): id is number => id !== undefined) ?? [];
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<Contract>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.DELETE);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
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
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name">
          <Button onClick={handleAddNew} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Add new
          </Button>

        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
