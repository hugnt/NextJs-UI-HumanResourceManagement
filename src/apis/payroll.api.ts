import { ColumnMeta, ColumnTableHeader, PayrollDataTable, PayrollListUpsert, PayrollResult, PayrollUpsert } from "@/data/schema/payroll.schema";
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
    getList: (period:string) => http.get<ApiResponse<PayrollDataTable[]>>(`/payrolls/${period}`),
};

export default payrollApiRequest;