import * as React from "react";

export interface PayrollContextProps {
    period: string;
    refesh: boolean;
    setPeriod: (period: string) => void,
    toggleRefesh: () => void,
}

const PayrollContext = React.createContext<PayrollContextProps|null>(null);

function PayrollProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const currentMonth: number = new Date().getMonth() + 1;
    const currenYear: number = new Date().getFullYear();


    const [refesh, setRefesh] = React.useState<boolean>(false);
    const [period, setPeriod] = React.useState<string>(`${currenYear}/${currentMonth.toString().padStart(2, '0')}`);

    const toggleRefesh = () => {
        setRefesh(!refesh)
    }

    const value:PayrollContextProps = {
        period: period,
        toggleRefesh: toggleRefesh,
        setPeriod: setPeriod,
        refesh: refesh
    }

    return (
        <PayrollContext.Provider value={value}>
            {children}
        </PayrollContext.Provider>
    )
}

export default {PayrollContext, PayrollProvider};
