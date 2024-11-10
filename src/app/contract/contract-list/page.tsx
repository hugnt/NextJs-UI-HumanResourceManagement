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

  const columnsDef: ColumnDef<Contract>[] = [
    {
      accessorKey: 'name', // Employee Level
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Employee Name' />
      ),
      cell: ({ row }) => <div>{row.getValue('name')}</div>
    },
    {
      accessorKey: 'contractTypeName', // Use contractTypeId to access the FK
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Contract Type' />
      ),
      cell: ({ row }) => (
        <div className='w-[200px]'>{row.getValue('contractTypeName')}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'startDate', // Add other columns as necessary
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Start Date' />
      ),
      cell: ({ row }) => <div>{row.getValue('startDate')}</div>,
    },
    {
      accessorKey: 'endDate', // Add other columns as necessary
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='End Date' />
      ),
      cell: ({ row }) => <div>{row.getValue('endDate')}</div>,
    },
    {
      accessorKey: 'employeeSignStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Employee Sign Status' />
      ),
      cell: ({ row }) => (
        <div>{getSignStatus(row.getValue('employeeSignStatus'))}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'companySignStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Company Sign Status' />
      ),
      cell: ({ row }) => (
        <div>{getSignStatus(row.getValue('companySignStatus'))}</div>
      ),
      enableSorting: true,
      enableHiding: false,
      enableColumnFilter: true
    },
    {
      accessorKey: 'contractStatus',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Contract Status' />
      ),
      cell: ({ row }) => (
        <div>{getContractStatus(row.getValue('contractStatus'))}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'typeContract',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Contract Type 2' />
      ),
      cell: ({ row }) => (
        <div>{getTypeContract(row.getValue('typeContract'))}</div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'positionName', // Position Name
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Position' />
      ),
      cell: ({ row }) => <div>{row.getValue('positionName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'departmentName', // Department Name
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Department' />
      ),
      cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'baseSalary', // Base Salary
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Base Salary' />
      ),
      cell: ({ row }) => <div>{row.getValue('baseSalary')}</div>,
    },
    {
      accessorKey: 'wageDaily', // Daily Wage
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Daily Wage' />
      ),
      cell: ({ row }) => <div>{row.getValue('wageDaily')}</div>,
    },
    {
      accessorKey: 'wageHourly', // Hourly Wage
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Hourly Wage' />
      ),
      cell: ({ row }) => <div>{row.getValue('wageHourly')}</div>,
    },
    {
      accessorKey: 'requiredDays', // Required Days
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Required Days' />
      ),
      cell: ({ row }) => <div>{row.getValue('requiredDays')}</div>,
    },
    {
      accessorKey: 'requiredHours', // Required Hours
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Required Hours' />
      ),
      cell: ({ row }) => <div>{row.getValue('requiredHours')}</div>,
    },
    {
      accessorKey: 'allowanceResults', // Array of allowances
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Allowances' />
      ),
      cell: ({ row }) => {
        const allowanceResults = row.getValue('allowanceResults') as {
          id?: number;
          name?: string;
          amount?: number;
          terms?: string;
        }[] || []; // Fallback to an empty array if not defined
        
        return allowanceResults.length > 0 ? (
          <div className="w-[400px]">
            {allowanceResults.map((allowance, index) => (
              <div key={index} className="mb-4">
                <div className="font-semibold">Allowance {index + 1}</div>
                <div>Name: {allowance.name}</div>
                <div>Amount: {allowance.amount}</div>
                <div>Terms: {allowance.terms}</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No allowances</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'insuranceResults', // Array of insurances
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Insurances' />
      ),
      cell: ({ row }) => {
        const insuranceResults = row.getValue('insuranceResults') as {
          id?: number;
          name?: string;
          percentCompany?: number;
          percentEmployee?: number;
        }[] || []; // Fallback to an empty array if not defined
    
        return insuranceResults.length > 0 ? (
          <div className="w-[200px]">
            {insuranceResults.map((insurance, index) => (
              <div key={index} className="mb-4">
                <div className="font-semibold">Insurance {index + 1}</div>
                <div>Name: {insurance.name}</div>
                <div>Company Percentage: {insurance.percentCompany}%</div>
                <div>Employee Percentage: {insurance.percentEmployee}%</div>
              </div>
            ))}
          </div>
        ) : (
          <div>No insurances</div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'level', // Employee Level
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Level' />
      ),
      cell: ({ row }) => <div>{row.getValue('level')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'major', // Employee Major
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Major' />
      ),
      cell: ({ row }) => <div>{row.getValue('major')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nationalID', // National ID
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='National ID' />
      ),
      cell: ({ row }) => <div>{row.getValue('nationalID')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nationalStartDate', // National ID Start Date
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='National ID Start Date' />
      ),
      cell: ({ row }) => <div>{row.getValue('nationalStartDate')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'address', // Employee Address
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Address' />
      ),
      cell: ({ row }) => <div>{row.getValue('address')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'countrySide', // Employee Country Side
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Country Side' />
      ),
      cell: ({ row }) => <div>{row.getValue('countrySide')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'gender', // Employee Gender
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Gender' />
      ),
      cell: ({ row }) => <div>{getGender(row.getValue('gender'))}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'dateOfBirth', // Employee Date of Birth
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Date of Birth' />
      ),
      cell: ({ row }) => <div>{row.getValue('dateOfBirth')}</div>,
    },

    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <DataTableRowActions row={row}
        handleView={() => handleView(row)}
        handleEdit={() => handleEdit(row)}
        handleDelete={() => handleDelete(row)} />,
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
          <Button onClick={handleAddNew} variant='outline' size='sm'  className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Add new
          </Button>
          
        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
