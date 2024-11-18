/* eslint-disable prefer-const */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { DataTable } from "primereact/datatable";
import { Column, ColumnBodyOptions } from "primereact/column";
import { ColumnGroup } from "primereact/columngroup";
import payrollApiRequest from "@/apis/payroll.api";
import { useQuery } from "@tanstack/react-query";
import { classNames } from "primereact/utils";
import { Row } from "primereact/row";
import { ColumnMeta, ColumnTableHeader, PayrollDataTable } from "@/data/schema/payroll.schema";
import { classFixBorderHeaderCol } from "@/lib/style";
import { cn, formatCurrency } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ExcelJS from 'exceljs'
import { Button } from "@/components/custom/button";
import { SiMicrosoftexcel } from "react-icons/si";
import { GrDocumentCsv, GrDocumentPdf } from "react-icons/gr";
import { TfiExport } from "react-icons/tfi";

type FormProps = {
  openCRUD: boolean,
  setOpenCRUD: (openCRUD: boolean) => void,
  payrollHistoryId: number
}

//react query key
const QUERY_KEY = {
  keyList: "salary-history",
  keyDetails: "salary-history-details",
}

export default function FormCRUD(props: FormProps) {
  const { openCRUD = false, setOpenCRUD = () => { }, payrollHistoryId = 0 } = props;

  // #region +TANSTACK QUERY
  const payrollHistoryDetails = useQuery({
    queryKey: [QUERY_KEY.keyDetails, payrollHistoryId],
    queryFn: () => { if (payrollHistoryId != 0) return payrollApiRequest.getPayrollHistoryDetails(payrollHistoryId) },
  });
  // #endregion

  const generateTableHeader = () => {
    const tableSchemaHeader = payrollHistoryDetails.data?.metadata?.payrollHeader ?? [];
    const displayColumns = payrollHistoryDetails.data?.metadata?.displayColumns??[];
    let lstParrentColHidden: number[] = [];
    let lstFieldHidden: string[] = [];
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
            className: 'relative after:absolute after:inset-0 after:z-[-1] after:border-y after:border-solid after:border-slate-300'
          }
        }}>
          {(i == 0) && <Column frozen header="STT" headerStyle={{ width: '3px' }} rowSpan={3} pt={{
            headerTitle: {
              className: 'text-xs whitespace-nowrap mx-auto'
            },
            headerCell: {
              className: `bg-[#f9fafb] text-xs border  whitespace-nowrap ${classFixBorderHeaderCol} `
            }
          }} />}
          {
            x.map((y, j) => {
              const isLastColumn = i == 0 && j == x.length - 1;
              const isFrozen = (i == 0 && (j == 0 || j == 1 || j == 2)) || isLastColumn;
              const fixColumnBorder = isFrozen ? "bg-[#f9fafb] after:absolute  after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 " : "";
              const headerWidth = (y.field.includes("dp.")) ? "w-[80px]" : "whitespace-nowrap";
              let isHidden = lstFieldHidden.includes(y.field);
              let colSpan = y.colSpan;
              let countDeSpan = lstParrentColHidden.filter(t => t == y.id).length;
              if (countDeSpan > 0) {
                //console.log("ok")
                colSpan -= countDeSpan;
                if (colSpan <= 0) isHidden = true;
              }

              return <Column hidden={isHidden} key={`${i}${j}`} field={y.field} frozen={isFrozen} alignFrozen={isLastColumn ? "right" : "left"}
                header={y.header} colSpan={colSpan} rowSpan={y.rowSpan}
                pt={{
                  headerTitle: {
                    className: classNames(`text-xs mx-auto ${headerWidth} bg-[#f9fafb]`)
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

    return <ColumnGroup>
      {headerColumnAPI}
    </ColumnGroup>;
  }

  const generateTableFooter = () => {
    const dataList = payrollHistoryDetails.data?.metadata?.payrollData ?? [];
    const tableSchemaColumn = payrollHistoryDetails.data?.metadata?.payrollColumn ?? [];
    const displayColumns = payrollHistoryDetails.data?.metadata?.displayColumns??[];
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
          <Column frozen pt={{ footerCell: { className: classNames(`bg-white border text-x after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 `) } }} />
          <Column footer="Tổng cộng" hidden={2 - decolSpan <= 0} frozen colSpan={2 - decolSpan} footerStyle={{ textAlign: 'right' }} pt={{
            footerCell: {
              className: classNames(`border text-xs whitespace-nowrap p-2 after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300  font-semibold bg-yellow-100 font-semibold text-end`)
            }
          }} />
          {footerColumnAPI}
        </Row>
      </ColumnGroup>
    );
    return footerColumn;
  }

  const exportExcelFile = () => {
    const payrollHeader: ColumnTableHeader[][] = payrollHistoryDetails.data?.metadata?.payrollHeader ?? [];
    const payrollColumn: ColumnMeta[] = payrollHistoryDetails.data?.metadata?.payrollColumn ?? []
    const payrollData: PayrollDataTable[] = payrollHistoryDetails.data?.metadata?.payrollData ?? [];
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("My Sheet");
    const startRow = 1;
    const tableMaxCols = payrollColumn.length;

    sheet.properties.defaultRowHeight = 20;

    sheet.getRow(startRow).values = [`BẢNG LƯƠNG THÁNG ${payrollHistoryDetails.data?.metadata?.month} NĂM ${payrollHistoryDetails.data?.metadata?.year}`];
    const cell_0 = sheet.getCell(startRow, 1).address;
    const cell_end = sheet.getCell(startRow, tableMaxCols).address;
    sheet.mergeCells(cell_0, cell_end);
    sheet.getRow(startRow).alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    sheet.getRow(startRow).font = {
      ...sheet.getRow(startRow).font,
      bold: true,
      size: 16
    };

    let lstColPass: number[] = [];
    payrollHeader?.map((x, i) => {
      //const startCol = spaceStart <= 0 ? 0 : spaceStart - 1;
      console.log("lstColPass", lstColPass)
      let startColSpace = 0;
      let currentColumn = 1;
      for (let j = 1; j <= x.length; j++) {
        const y = x[j - 1];
        const rowSpan = y.rowSpan <= 1 ? 0 : y.rowSpan;
        const colSpan = y.colSpan <= 1 ? 0 : y.colSpan;
        const curRow = startRow + i + 1;
        let curCol = currentColumn + startColSpace;
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

        console.log("j, startColSpace:", j, " - ", startColSpace)
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


    payrollData?.map((payroll, _i) => {
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

  const currencyTemplate = (rowData: PayrollDataTable, options: ColumnBodyOptions) => {
    const fieldName = options.field.replace("dp.", "");
    if (fieldName == "PARAM_BHXH_PERCENT_NLD" || fieldName == "PARAM_TAX_RATE") {
      return rowData.dp[fieldName] * 100 + "%";
    }
    if (typeof rowData.dp[fieldName] === 'number') return `${formatCurrency(rowData.dp[fieldName])}`;
    else return rowData.dp[fieldName]
  };

  return (
    <div>
      <Sheet open={openCRUD} onOpenChange={setOpenCRUD}>
        <SheetContent className="p-0 overflow-y-auto sm:max-w-[1300px] !sm:w-[1300px] min-w-[1300px]">
          <SheetHeader className="px-4 pt-3">
            <SheetTitle>Bảng lương tổng hợp tháng {payrollHistoryDetails.data?.metadata?.month} năm  {payrollHistoryDetails.data?.metadata?.year}</SheetTitle>
            <SheetDescription className="flex items-center justify-between">
              Bảng lương đã tổng hợp theo dữ liệu vào thời điểm {payrollHistoryDetails.data?.metadata?.createdAt?.toString() ?? ""}
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
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <DataTable
              loading={payrollHistoryDetails.isLoading}
              value={payrollHistoryDetails.data?.metadata?.payrollData}
              headerColumnGroup={generateTableHeader()}
              footerColumnGroup={generateTableFooter()}
              showGridlines size="small" scrollable
              scrollHeight="400px"
              selectionMode="single"

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
              <Column header="#" frozen headerStyle={{ width: '3px' }} body={(_data, options) => options.rowIndex + 1} pt={{
                bodyCell: {
                  className: classNames(`bg-white text-xs my-auto border after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 text-center`)
                }
              }} />
              {
                payrollHistoryDetails.data &&
                payrollHistoryDetails.data.metadata &&
                payrollHistoryDetails.data.metadata.payrollColumn &&
                payrollHistoryDetails.data.metadata.payrollColumn.map((col, i) => {
                  const isLastColumn = payrollHistoryDetails?.data?.metadata?.payrollColumn &&
                    i === payrollHistoryDetails.data.metadata.payrollColumn.length - 1;
                  const isFrozen = (i == 0 || i == 1 || i == 2 || isLastColumn);
                  const cellStyle = i == 0 ? '' : 'text-center';
                  const fixColumnBorder = isFrozen ? "after:absolute after:inset-0 after:start-[-1px] after:border-x after:border-solid after:border-slate-300 bg-yellow-100 font-semibold" : "bg-white";
                  const cellAlignment = (i == 0 || i == 1) ? "text-start" : "text-end";

                  const isHidden = payrollHistoryDetails.data?.metadata?.displayColumns?.map(x => x.field).includes(col.field);
                  return <Column hidden={isHidden} body={col.field.includes("dp.") && currencyTemplate} frozen={isFrozen} alignFrozen={isLastColumn ? "right" : "left"}
                    key={col.field} field={col.field} header={col.header} pt={{
                      columnTitle: {
                        className: 'text-xs'
                      },
                      bodyCell: {
                        className: cn(`border text-xs whitespace-nowrap p-2 ${cellStyle} ${fixColumnBorder} ${cellAlignment} `)
                      }
                    }} />
                })
              }
            </DataTable>
          </div>

        </SheetContent>
      </Sheet>
    </div >
  )
}
