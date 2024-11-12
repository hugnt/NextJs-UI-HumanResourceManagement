/* eslint-disable no-var */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import payrollApiRequest from "@/apis/payroll.api";
import FormAddFormula from "@/app/payroll/salary-summary/form-add-formula";
import FormAddManySC from "@/app/payroll/salary-summary/form-add-many-sc";
import FormAddOtherSC from "@/app/payroll/salary-summary/form-add-other-sc";
import FormAE from "@/app/payroll/salary-summary/form-add-payroll";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DatePickerRange } from "@/components/custom/date-picker-range";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ColumnMeta, ColumnTableHeader, PayrollDataTable, PayrollResult } from "@/data/schema/payroll.schema";
import { classFixBorderHeaderCol } from "@/lib/style";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import { IconClearFormatting, IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { FilterMatchMode } from "primereact/api";
import { Column, ColumnBodyOptions } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import { DataTable, DataTableFilterMeta, DataTableRowClickEvent, DataTableSelectEvent } from "primereact/datatable";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Row } from "primereact/row";
import { classNames } from "primereact/utils";
import { ReactNode, useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { TfiExport } from "react-icons/tfi";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentPdf } from "react-icons/gr";
import { GrDocumentCsv } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import FormDetails from "@/app/payroll/salary-summary/form-details";
import { useMutation } from "@tanstack/react-query";
import FormPayslip from "@/app/payroll/salary-summary/form-send-payslip";
import ExcelJS from 'exceljs'

const pathList: Array<PathItem> = [
  {
    name: "Salary components",
    url: ""
  },
  {
    name: "Payroll Calculation",
    url: "/salary-components/payroll-calculation"
  },
];


//react query key
const QUERY_KEY = {
  keyList: "payroll-list",
  keyTableSchemaHeader: 'payroll-table-schema-header',
  keyTableSchemaColumn: 'payroll-table-schema-column',
  keyEmployeeSalaryList: 'payrolls-employee-salary-list',
}

export default function SalarySummaryList() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth: number = new Date().getMonth() + 1;
  const currenYear: number = new Date().getFullYear();
  let timeoutId: NodeJS.Timeout;

  const [loading, setLoading] = useState<boolean>(false);

  const [headerGroup, setHeaderGroup] = useState<ReactNode>();
  const [footerGroup, setFooterGroup] = useState<ReactNode>();
  const [payrollHeader, setPayrollHeader] = useState<ColumnTableHeader[][]>([]);
  const [payrollColumn, setPayrollColumn] = useState<ColumnMeta[]>([]);
  const [payrollData, setPayrollData] = useState<PayrollDataTable[]>([]);
  const [payrollDataAllConst, setPayrollDataAllConst] = useState<PayrollDataTable[]>([]);

  const [highlightColumns, setHighlightColumns] = useState<ColumnMeta[]>([]);
  const [displayColumns, setDisplayColumns] = useState<ColumnMeta[]>([]);
  const [employeeListSc, setEmployeeListSc] = useState<PayrollResult[]>([]);

  const [selectedPayroll, setSelectedPayroll] = useState<PayrollResult | undefined>(undefined);
  const [listAllEmployeeIds, setListAllEmployeeIds] = useState<number[]>([]);

  const [openAE, setOpenAE] = useState<boolean>(false);
  const [openFormManySC, setOpenFormManySC] = useState<boolean>(false);
  const [openFormOtherSC, setOpenFormOtherSC] = useState<boolean>(false);
  const [openFormFormula, setOpenFormFormula] = useState<boolean>(false);
  const [openFormDetails, setOpenFormDetails] = useState<boolean>(false);
  const [openFormPayslip, setOpenFormPayslip] = useState<boolean>(false);

  const [period, setPeriod] = useState<string>(`${currenYear}/${currentMonth.toString().padStart(2, '0')}`);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });

  const [refesh, setRefesh] = useState<boolean>(false);


  const getPayrollById = useMutation({
    mutationFn: (id: number) => payrollApiRequest.getEmployeeSalaryDetails(id),
    onSuccess: (data) => {
      setSelectedPayroll(data?.metadata)
      setOpenFormDetails(true);
    }
  });


  //ACTION HANDLER
  const handleAddNew = () => {
    setOpenAE(true);
  };

  const handleAddManySC = () => {
    setOpenFormManySC(true);
  };

  const handleAddOtherSC = () => {
    setOpenFormOtherSC(true);
  };

  const handleAddFormula = () => {
    setOpenFormFormula(true);
  };

  const handleSendPayslip = () => {
    setOpenFormPayslip(true);
  };

  useEffect(() => {
    const fetchData = async () => {

      try {
        setLoading(true);
        const [dataListApi, schemaHeaderApi, schemaColumnApi, employeeListScApi] = await Promise.all([
          payrollApiRequest.getList(period),
          payrollApiRequest.getPayrollTableHeader(period),
          payrollApiRequest.getPayrollTableColumn(period),
          payrollApiRequest.getEmployeeSalaryList(period),
        ]);
        // console.log(dataList, schemaHeader, schemaColumn);
        if (dataListApi.isSuccess == false
          || schemaHeaderApi.isSuccess == false
          || schemaColumnApi.isSuccess == false
          || employeeListScApi.isSuccess == false) {
          setLoading(false);
          handleErrorApi({ error: 'Lỗi loading bảng động' });
          return;
        }
        const payrollDataList = dataListApi?.metadata ?? [];
        const payrollTableHeader = schemaHeaderApi?.metadata ?? [];
        const payrollTableColumn = schemaColumnApi?.metadata ?? [];
        const employeeListScData = employeeListScApi?.metadata ?? [];

        const headerColumn = generateTableHeader(payrollTableHeader);
        const footerColumn = generateTableFooter(payrollDataList, payrollTableColumn);
        setHeaderGroup(headerColumn);
        setFooterGroup(footerColumn);

        setPayrollHeader(payrollTableHeader);
        setPayrollColumn(payrollTableColumn);
        setPayrollData(payrollDataList);
        setEmployeeListSc(employeeListScData);

        setPayrollDataAllConst(payrollDataList);
        const lstEmployyId = payrollDataList.map(x => x.employeeId);
        setListAllEmployeeIds(lstEmployyId);

        setLoading(false);
      } catch (error) {
        setLoading(false);
        handleErrorApi({ error: error });
        console.error('Error fetching data:', error);
      }
    };

    fetchData();


  }, [period, refesh]);

  useEffect(() => {
    setLoading(true);
    const headerColumn = generateTableHeader(payrollHeader);
    const footerColumn = generateTableFooter(payrollData, payrollColumn);
    setHeaderGroup(headerColumn);
    setFooterGroup(footerColumn);
    setLoading(false);
  }, [displayColumns])



  const generateTableHeader = (payrollHeaderProp: ColumnTableHeader[][]) => {
    const tableSchemaHeader = payrollHeaderProp ?? [];
    var lstParrentColHidden: number[] = [];
    var lstFieldHidden: string[] = [];
    tableSchemaHeader.forEach(row => {
      row.forEach(col => {
        if (displayColumns.map(z => z.field).includes(col.field)) {
          lstParrentColHidden.push(...col.listParentIds);
          lstFieldHidden.push(col.field);
        }
      });
    });
    const headerColumnAPI = tableSchemaHeader.map((x, i) => {
      return (
        <Row key={i} pt={{
          root: {
            className: 'relative after:absolute  after:inset-0 after:z-[-1] after:border-y after:border-solid after:border-slate-300'
          }
        }}>
          {(i == 0) && <Column frozen={!(payrollColumn.length == displayColumns.length)} header="STT" headerStyle={{ width: '3px' }} rowSpan={3} pt={{
            headerTitle: {
              className: 'text-xs whitespace-nowrap mx-auto'
            },
            headerCell: {
              className: `text-xs border  whitespace-nowrap ${classFixBorderHeaderCol} `
            }
          }} />}
          {
            x.map((y, j) => {
              const isLastColumn = i == 0 && j == x.length - 1;
              const isFrozen = (i == 0 && (j == 0 || j == 1 || j == 2)) || isLastColumn;
              const fixColumnBorder = isFrozen ? "after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300" : "";
              const headerWidth = (y.field.includes("dp.")) ? "w-[80px]" : "whitespace-nowrap";
              var isHidden = lstFieldHidden.includes(y.field);
              var colSpan = y.colSpan;
              var countDeSpan = lstParrentColHidden.filter(t => t == y.id).length;
              if (countDeSpan > 0) {
                //console.log("ok")
                colSpan -= countDeSpan;
                if (colSpan <= 0) isHidden = true;
              }

              return <Column hidden={isHidden} key={`${i}${j}`} field={y.field} frozen={isFrozen} alignFrozen={isLastColumn ? "right" : "left"}
                header={y.header} colSpan={colSpan} rowSpan={y.rowSpan}
                pt={{
                  headerTitle: {
                    className: classNames(`text-xs mx-auto ${headerWidth}`)
                  },
                  headerCell: {
                    className: classNames(`text-xs my-auto border ${fixColumnBorder} text-center`)
                  }
                }} />
            })
          }
        </Row>
      )
    });
    const headerColumn = (
      <ColumnGroup>
        {headerColumnAPI}
      </ColumnGroup>
    );
    return headerColumn;
  }

  const generateTableFooter = (payrollDataProp: PayrollDataTable[], payrollColumnProp: ColumnMeta[]) => {
    const dataList = payrollDataProp ?? [];
    const tableSchemaColumn = payrollColumnProp ?? [];
    const footerColumnAPI = tableSchemaColumn.map((col, i) => {
      if (i < 2) return;
      const isLastColumn = i == tableSchemaColumn.length - 1;
      const isFrozen = (i == 2 || isLastColumn);
      const fixColumnBorder = isFrozen ? "after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 bg-yellow-100 font-semibold" : "";

      const fieldName = col.field.replace("dp.", "");
      const total = dataList.reduce((accumulator, current) => {
        return accumulator + (current.dp[fieldName] || 0);
      }, 0);

      let footerTemplate = formatCurrency(total);
      if (fieldName == "PARAM_BHXH_PERCENT_NLD" || fieldName == "PARAM_TAX_RATE") {
        footerTemplate = "";
      }

      const isHidden = displayColumns.map(z => z.field).includes(col.field);
      return <Column hidden={isHidden} footer={footerTemplate} frozen={isFrozen} alignFrozen={isLastColumn ? "right" : "left"}
        key={col.field} pt={{
          footerCell: {
            className: classNames(`border text-xs whitespace-nowrap p-2 ${fixColumnBorder} text-end`)
          }
        }} />
    })
    const decolSpan = displayColumns.map(z => z.field).filter(x => x == "employeeName" || x == "departmentName").length;
    const footerColumn = (
      <ColumnGroup>
        <Row>
          <Column frozen pt={{ footerCell: { className: classNames(`border text-x after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 `) } }} />
          <Column footer="Tổng cộng" hidden={2 - decolSpan <= 0} frozen colSpan={2 - decolSpan} footerStyle={{ textAlign: 'right' }} pt={{
            footerCell: {
              className: classNames(`border text-xs whitespace-nowrap p-2 after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 bg-yellow-100 font-semibold bg-yellow-100 font-semibold text-end`)
            }
          }} />
          {footerColumnAPI}
        </Row>
      </ColumnGroup>
    );
    return footerColumn;
  }

  const toggleRefesh = () => {
    console.log("Refesh");
    setRefesh(!refesh)
  }

  const handleChangePeriod = (period: string) => {
    const month = Number(period.split('/')[1]) - 1;
    const year = Number(period.split('/')[0]);

    let lastDayOfMonth;
    if (year === currenYear && month === currentMonth - 1) {
      lastDayOfMonth = currentDay;
    } else lastDayOfMonth = new Date(year, month + 1, 0).getDate();

    const range: DateRange = {
      from: new Date(year, month, 1), // First day of the month
      to: new Date(year, month, lastDayOfMonth), // Last day of the month
    };
    setPeriod(period);
    setDateRange(range)
  }

  const currencyTemplate = (rowData: PayrollDataTable, options: ColumnBodyOptions) => {
    const fieldName = options.field.replace("dp.", "");
    if (fieldName == "PARAM_BHXH_PERCENT_NLD" || fieldName == "PARAM_TAX_RATE") {
      return rowData.dp[fieldName] * 100 + "%";
    }
    if (typeof rowData.dp[fieldName] === 'number') return `${formatCurrency(rowData.dp[fieldName])}`;
    else return rowData.dp[fieldName]
  };

  const handleChangeHighlighCol = (e: MultiSelectChangeEvent) => {
    let selectedColumns = e.value;
    let orderedSelectedColumns = payrollColumn.filter((col) => selectedColumns.some((sCol: ColumnMeta) => sCol.field === col.field));

    setHighlightColumns(orderedSelectedColumns);
  }

  const handleDisplayCol = (e: MultiSelectChangeEvent) => {

    let selectedColumns = e.value;
    let orderedSelectedColumns = payrollColumn.filter((col) => selectedColumns.some((sCol: ColumnMeta) => sCol.field === col.field));
    setDisplayColumns(orderedSelectedColumns);

  }

  const handleSearchChange = (key: string) => {
    clearTimeout(timeoutId);
    const matchingData = payrollDataAllConst.filter(x => x.employeeName.toLowerCase().includes(key.toLowerCase()) || x.departmentName.toLowerCase().includes(key.toLowerCase()));
    if (key.trim() == "") {
      setPayrollData(payrollDataAllConst);
    }
    else {
      timeoutId = setTimeout(() => {
        setPayrollData(matchingData);
      }, 500)
    }

  }

  const onRowSelect = (e: DataTableRowClickEvent) => {
    const selectedData: PayrollDataTable = e.data;
    getPayrollById.mutate(selectedData.payrollId);
  };

  const exportExcelFile = () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    const startRow = 1;
    const startTableRow = 5;
    const tableMaxCols = payrollColumn.length;

    sheet.properties.defaultRowHeight = 20;

    sheet.getRow(startRow).values = ['BẢNG LƯƠNG THÁNG ? NĂM 2024'];
    const cell_0 = sheet.getCell(startRow, 1).address;
    const cell_end = sheet.getCell(startRow, tableMaxCols).address;
    sheet.mergeCells(cell_0, cell_end);

    var spaceStart = 0;
    var lstColPass: number[] = [];
    payrollHeader?.map((x, i) => {
      //const startCol = spaceStart <= 0 ? 0 : spaceStart - 1;
      console.log("lstColPass", lstColPass)
      var startColSpace = 0;
      var currentColumn = 1;
      for (let j = 1; j <= x.length; j++) {
        const y = x[j - 1];
        const rowSpan = y.rowSpan <= 1 ? 0 : y.rowSpan;
        const colSpan = y.colSpan <= 1 ? 0 : y.colSpan;
        const curRow = startRow + i + 1;
        var curCol = currentColumn + startColSpace;
        while (lstColPass.includes(curCol)) {
          curCol += 1;
          currentColumn++;
        }
        //if(checkIn) startColSpace+=1;//điều hướng tới ô kế bên
        if (rowSpan != 0) {
          const cell_first = sheet.getCell(curRow, curCol).address;
          const cell_last = sheet.getCell(curRow + rowSpan - 1, curCol).address;
          sheet.mergeCells(cell_first, cell_last);
          lstColPass.push(curCol);
          //spaceStart += 1;
        }
        if (colSpan != 0) {
          const cell_first = sheet.getCell(curRow, curCol).address;
          const cell_last = sheet.getCell(curRow, curCol + colSpan - 1).address;
          console.log("cell_first,cell_last:", cell_first, "-", cell_last)
          sheet.mergeCells(cell_first, cell_last);
          console.log("cell_first,cell_last:", cell_first, "-", cell_last)
          startColSpace += colSpan - 1;       
        }
        currentColumn++;

        console.log("j, startColSpace:",j," - ",startColSpace)
        sheet.getCell(curRow, curCol).value = y.header;
        console.log(curRow + "-" + curCol + ":" + y.header)
        sheet.getCell(curRow, curCol).alignment = {
          horizontal: 'center',
          vertical: 'middle'
        };
      }

      sheet.getRow(startRow + i + 1).font = {
        ...sheet.getRow(startRow + i + 1).font,
        bold: true,
      };

    });

    sheet.columns = payrollColumn.map(x => ({
      key: x.field.replace("dp.", ""),
    }));

    sheet.columns.forEach((col, i) => {
      col.width = payrollColumn[i].header.length < 12 ? 12 : payrollColumn[i].header.length
    })


    payrollData?.map((payroll, i) => {
      const rowData: any = {
        employeeName: payroll.employeeName,
        departmentName: payroll.departmentName,
      };

      for (const [key, value] of Object.entries(payroll.dp)) {
        rowData[key] = value;
      }
      //console.log("rowData: ",rowData)
      sheet.addRow(rowData);
    })

    //console.log("columns: ",sheet.columns);

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "test2.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2 '>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Payroll Calculation</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>
      <div className="flex justify-between space-x-2">
        <div className="flex space-x-2">
          <DatePickerRange dateRange={dateRange} setDateRage={setDateRange} />
          <Select value={period} onValueChange={(e) => handleChangePeriod(e)}>
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Chọn kì lương" />
            </SelectTrigger>
            <SelectContent>
              {
                Array.from({ length: currentMonth }, (v, i) => {
                  const month = (currentMonth - i).toString().padStart(2, '0');
                  return (
                    <SelectItem key={i} value={`${currenYear}/${month}`}>
                      {`${month}/${currenYear}`}
                    </SelectItem>
                  );
                })
              }
            </SelectContent>
          </Select>
          <Button variant='outline' size='sm' className='bg-primary ml-auto hidden h-8 lg:flex text-white'>
            <IconSearch className='h-4 w-4 me-1' />Lọc
          </Button>
        </div>
        <div className="flex space-x-1 justify-end">
          <Button onClick={handleAddNew} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex bg-primary text-white'>
            <IconPlus className='mr-1 h-4 w-4 ' />Nhân viên
          </Button>
          <Button variant='outline' size='sm' onClick={handleAddOtherSC} className='border-primary ml-auto hidden h-8 lg:flex'>
            <IconPlus className='h-4 w-4 mr-1' />Khoản khác
          </Button>
          <Button variant='outline' size='sm' onClick={handleAddManySC} className='border-primary ml-auto hidden h-8 lg:flex '>
            <IconPlus className='h-4 w-4 mr-1' />Khoản thưởng/trừ
          </Button>
          <Button variant='outline' size='sm' onClick={handleAddFormula} className='border-primary ml-auto hidden h-8 lg:flex '>
            <IconClearFormatting className='h-4 w-4 mr-1' />Cập nhật công thức
          </Button>
        </div>
      </div>

      <div className='flex justify-between items-center my-2'>
        <div className="flex items-center space-x-2">
          <Input className="w-[150px] lg:w-[250px] h-8 "
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearchChange(e.target.value)}
            placeholder="Tìm kiếm nhân viên, phòng ban, ..." />

          <MultiSelect
            loading={loading}
            onChange={handleChangeHighlighCol}

            value={highlightColumns}
            options={payrollColumn}
            optionLabel="header"
            filter
            placeholder="Select highlight columns"
            maxSelectedLabels={3} className="w-[150px]" pt={{
              label: {
                className: 'text-xs p-2'
              },
              wrapper: {
                className: 'h-[300px]'
              },
              root: {
                className: 'border'
              },
              trigger: {
                className: 'w-[12px] mx-2'
              },
              header: {
                className: 'p-2'
              },
              item: {
                className: 'text-xs p-2'
              },
              headerCheckbox: {
                root: () => ({
                  className: classNames(
                    'flex items-center justify-center',
                    'border w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.1rem_rgba(191,219,254,1)]',
                  )
                })
              },
              filterInput: {
                root: {
                  className: classNames(
                    'h-8 ps-3', 'w-full',
                    'font-sans text-xs text-gray-700 bg-white border border-gray-300 transition duration-200 rounded-lg appearance-none',
                    'dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300',
                    'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.1rem_rgba(191,219,254,1)]'
                  )
                }
              }
            }} />

          <MultiSelect
            loading={loading}
            onChange={handleDisplayCol}
            options={payrollColumn}
            value={displayColumns}
            optionLabel="header"
            filter
            placeholder="Select hidden columns"
            maxSelectedLabels={3} className="w-[200px]" pt={{
              label: {
                className: 'text-xs p-2'
              },
              wrapper: {
                className: 'h-[300px]'
              },
              root: {
                className: 'border'
              },
              trigger: {
                className: 'w-[12px] mx-2'
              },
              header: {
                className: 'p-2'
              },
              item: {
                className: 'text-xs p-2'
              },
              headerCheckbox: {
                root: () => ({
                  className: classNames(
                    'flex items-center justify-center',
                    'border w-6 h-6 text-gray-600 rounded-lg transition-colors duration-200',
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.1rem_rgba(191,219,254,1)]',
                  )
                })
              },
              filterInput: {
                root: {
                  className: classNames(
                    'h-8 ps-3', 'w-full',
                    'font-sans text-xs text-gray-700 bg-white border border-gray-300 transition duration-200 rounded-lg appearance-none',
                    'dark:bg-gray-900 dark:border-blue-900/40 dark:hover:border-blue-300',
                    'hover:border-blue-500 focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.1rem_rgba(191,219,254,1)]'
                  )
                }
              }
            }} />
        </div>
        <div className="flex justify-end space-x-1">
          <Button onClick={toggleRefesh} variant='outline' size='sm' className='bg-green-500 ml-auto hidden h-8 lg:flex text-white '>
            <IconRefresh className='mr-1 h-4 w-4' />Sync
          </Button>
          <Button onClick={toggleRefesh} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex  '>
            <FaSave className='mr-1 h-4 w-4' />Lưu kết quả
          </Button>
          <Button onClick={handleSendPayslip} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex  '>
            <IoIosSend className='mr-1 h-4 w-4' />Gửi phiếu lương
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="h-8">
              <Button variant="outline"><TfiExport size={16} className="me-2" />Export</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Choose export file</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportExcelFile}>
                <SiMicrosoftexcel size={16} className="me-2" /> xlsx
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GrDocumentPdf size={16} className="me-2" />pdf
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GrDocumentCsv size={16} className="me-2" />csv
              </DropdownMenuItem>
              <DropdownMenuSeparator />

            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-2">
        <div>
          <h1 className="uppercase text-center font-semibold text-lg bg-[#f9fafb] py-1 border border-b-0">
            Bảng lương tổng hợp tháng {period.split('/')[1]} năm {period.split('/')[0]}
          </h1>
        </div>
        <DataTable
          loading={loading}
          value={payrollData}
          headerColumnGroup={headerGroup}
          footerColumnGroup={footerGroup}
          showGridlines size="small" scrollable
          scrollHeight="400px"
          selectionMode="single"
          onRowDoubleClick={onRowSelect}

          emptyMessage="No employee found."
          pt={{
            table: {
              className: 'border border-collapse '
            },
            wrapper: {
              className: '!min-h-[300px] !max-h-[800px]'
            },
            loadingOverlay: {
              className: 'bg-white'
            },
            loadingIcon: {
              className: 'w-8 h-8 text-blue-500'
            }
          }}>
          <Column header="#" frozen={!(payrollColumn.length == displayColumns.length)} headerStyle={{ width: '3px' }} body={(data, options) => options.rowIndex + 1} pt={{
            bodyCell: {
              className: classNames(`text-xs my-auto border after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 text-center`)
            }
          }} />
          {

            payrollColumn.map((col, i) => {
              const isLastColumn = i == payrollColumn.length - 1;
              const isFrozen = (i == 0 || i == 1 || i == 2 || isLastColumn);
              const cellStyle = i == 0 ? '' : 'text-center';
              const fixColumnBorder = isFrozen ? "after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 bg-yellow-100 font-semibold" : "";
              const cellAlignment = (i == 0 || i == 1) ? "text-start" : "text-end";
              const isHighlight = highlightColumns.map(x => x.field).includes(col.field);
              const isHidden = displayColumns.map(x => x.field).includes(col.field);
              return <Column hidden={isHidden} body={col.field.includes("dp.") && currencyTemplate} frozen={isFrozen} alignFrozen={isLastColumn ? "right" : "left"}
                key={col.field} field={col.field} header={col.header} pt={{
                  columnTitle: {
                    className: 'text-xs'
                  },
                  bodyCell: {
                    className: cn(`border text-xs whitespace-nowrap p-2 ${cellStyle} ${fixColumnBorder} ${cellAlignment} ${isHighlight && 'bg-green-300'}`)
                  }
                }} />
            })
          }
        </DataTable>
      </div>
      <FormAE openAE={openAE} setOpenAE={setOpenAE} period={period} listAllEmployeeIds={listAllEmployeeIds} toggleRefesh={toggleRefesh} />
      <FormAddManySC employeeListSc={employeeListSc} openForm={openFormManySC} setOpenForm={setOpenFormManySC} period={period} toggleRefesh={toggleRefesh} />
      <FormAddOtherSC employeeListSc={employeeListSc} openForm={openFormOtherSC} setOpenForm={setOpenFormOtherSC} period={period} toggleRefesh={toggleRefesh} />
      <FormAddFormula employeeListSc={employeeListSc} openForm={openFormFormula} setOpenForm={setOpenFormFormula} period={period} toggleRefesh={toggleRefesh} />
      <FormDetails payroll={selectedPayroll} openForm={openFormDetails} setOpenForm={setOpenFormDetails} period={period} toggleRefesh={toggleRefesh} />
      <FormPayslip employeeListSc={employeeListSc} openAE={openFormPayslip} setOpenAE={setOpenFormPayslip} period={period} />
    </>
  )
};
