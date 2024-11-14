
export interface LeaveApplication {
    id: number;
    replyMessage?: string;
    description?: string;  
    statusLeave: number;  
    timeLeave: number;    
    refuseReason?: string; 
    employeeId: number;  
    createdAt: Date;      
    updatedAt: Date;     
}

export interface ListSalary {
    baseSalary: number;
    count: number;
}

export interface ApplicantByPosition{
    name:string;
    count:number;
}

export interface Payroll{
    id:number;
    userName:string;
    payperiod: string;
    createAt: Date;
    updateAt: Date;

}

export interface Contract {
    id: number;
    contractSalaryId: number;   
    contractTypeId: number;     
    startDate: string;           
    endDate: string;               
    name?: string;              
    dateOfBirth: Date;         
    gender: boolean;           
    address?: string;         
    countrySide?: string;      
    nationalID?: string;               
    positionId: number;         
    contractStatus: number;     
    typeContract: number;       
    createdAt: Date;            
    updatedAt: Date;                   
}

