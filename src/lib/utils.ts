/* eslint-disable @typescript-eslint/no-explicit-any */

import { toaster } from "@/components/custom/_toast"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrorApi = ({error, duration}:{
  error: any,
  duration?:number
}) => {
    if(Array.isArray(error)){
      for (let i = 0; i < error.length; i++) {
        toaster.error({
          title:'System Error',
          message: error[i]??"Undefined Error",
        },{
          position:"bottom-right",
          autoClose: duration ?? 2000
        })
      }
    }
    else{
      toaster.error({
        title:'Uncontroled Error',
        message: error??"Undefined Error",
      },{
        position:"bottom-right",
        autoClose: duration ?? 2000
      })
    }
    throw new Error('API fetching error', error);
}
export const handleSuccessApi = ({title,message,duration}:{
  title?: string,
  message?: string,
  duration?:number
}) => {
    toaster.success({
      title: title??"Process Completed",
      message: message??"Process Completed"
    },{
      position:"bottom-right",
      autoClose: duration ?? 2000
    })
}
export function assertApiResponse<T>(data: any): T {
  console.log("http data:", data)
  if (typeof data.isSuccess !== 'boolean' || 
      (Array.isArray(data.message) === false && data.message !== null)) {
        throw new Error('Invalid API response structure');
  }
  else if(data.isSuccess == false){
      //handleErrorApi({error:data.message});
      //console.log(data.message)
      throw new Array(data.message);
  }
  return data as T; 
}


export const formatCurrency = (value?: number) => {
  if(!value) return 0;
  const formattedValue = new Intl.NumberFormat('it-IT', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
  return formattedValue;
};





const exportExcel = (data:any,fileName:string) => {
  import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
      });

      saveAsExcelFile(excelBuffer, fileName);
  });
};

const saveAsExcelFile = (buffer:any, fileName:string) => {
  import('file-saver').then((module) => {
      if (module && module.default) {
          let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
          let EXCEL_EXTENSION = '.xlsx';
          const data = new Blob([buffer], {
              type: EXCEL_TYPE
          });

          module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
      }
  });
};
