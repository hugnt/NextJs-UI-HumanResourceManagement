import { ColumnMeta, ColumnTableHeader, PayrollDataTable, PayrollFilter, PayrollHistory, PayrollListUpsert, PayrollResult, PayrollUpsert } from "@/data/schema/payroll.schema";
import { ApiResponse } from "@/data/type/response.type";
import http from "@/lib/http";
import { TreeNode } from "primereact/treenode";

const payrollApiRequest = {
    getCompanyTree: () => http.get<ApiResponse<TreeNode[]>>('/payrolls/company-tree'),
    updatePayrollList: (body: PayrollListUpsert) => http.put<ApiResponse<boolean>>('/payrolls/update-payroll/list',body),
    updatePayrollDetails: (body: PayrollUpsert) => http.put<ApiResponse<boolean>>('/payrolls/update-payroll/details',body),
    updatePayrollOtherSC: (body: PayrollUpsert[]) => http.put<ApiResponse<boolean>>('/payrolls/update-payroll/other-sc',body),
    updatePayrollBonusSC: (body: PayrollUpsert[]) => http.put<ApiResponse<boolean>>('/payrolls/update-payroll/bonus-sc',body),
    updatePayrollDeductionSC: (body: PayrollUpsert[]) => http.put<ApiResponse<boolean>>('/payrolls/update-payroll/deduction-sc',body),
    updatePayrollFormula: (body: PayrollUpsert[]) => http.put<ApiResponse<boolean>>('/payrolls/update-payroll/formula',body),
    getEmployeeSalaryList: (period:string) => http.get<ApiResponse<PayrollResult[]>>(`/payrolls/employee-salary/list/${period}`),
    getEmployeeSalaryDetails: (payrollId:number) => http.get<ApiResponse<PayrollResult>>(`/payrolls/employee-salary/details/${payrollId}`),
    getDynamicColumn: (sc_type:number) => http.get<ApiResponse<ColumnMeta[]>>(`/payrolls/salary-components/${sc_type}`),
    getPayrollTableHeader: (period:string) => http.get<ApiResponse<ColumnTableHeader[][]>>(`/payrolls/table-schema/header/${period}`),
    getPayrollTableColumn: (period:string) => http.get<ApiResponse<ColumnMeta[]>>(`/payrolls/table-schema/column/${period}`),
    getList: (period:string, body:PayrollFilter) => http.post<ApiResponse<PayrollDataTable[]>>(`/payrolls/${period}`,body),
    sendPayslip: (period:string,body: PayrollFilter) => http.post<ApiResponse<boolean>>(`/payrolls/employee-salary/payslip/${period}`,body),
    saveHistory: (body: PayrollHistory) => http.post<ApiResponse<boolean>>(`/payrolls/table-schema/history`,body),
    getAllPayrollHistory: () => http.get<ApiResponse<PayrollHistory[]>>(`/payrolls/table-schema/history`),
    getPayrollHistoryDetails: (id:number) => http.get<ApiResponse<PayrollHistory>>(`/payrolls/table-schema/history/${id}`),
    deletePayrollHistory: (id: number) => http.delete<ApiResponse<boolean>>(`/payrolls/table-schema/history/${id}`)
};

export default payrollApiRequest;