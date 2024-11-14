"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import authApiRequest from '@/apis/auth.api';
import { AccountInfo, Role } from '@/data/schema/auth.schema';
import loading from '@/app/loading';
import { TypeContract } from '@/data/schema/contract.schema';

// Define the context type
interface AuthContextType {
    currentUser: AccountInfo | undefined;
}

// Define context with the appropriate type
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to access the current user context
export const useCurrentUser = () => {
    // const context = useContext(AuthContext);
    // if (!context) {
    //     throw new Error("useCurrentUser must be used within an AuthProvider");
    // }
    const context = {
        currentUser:{
            id: 1,
            email: 'hoang@gmail.com',
            name: 'Hoang Nguyen',
            role: Role.User,
            typeContrat: TypeContract.Fulltime
        }

    }
    return context;
}

// Provider to manage and provide user information
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<AccountInfo | undefined>(undefined);
    const { data, isSuccess, isLoading } = useQuery({
        queryKey: ["current-user"],
        queryFn: () => authApiRequest.getCurrentUser(),
    });

    useEffect(() => {
        if (isSuccess && data) {
            setCurrentUser(data.metadata);
        }
    }, [isSuccess, data]);

    // Provide `currentUser` and `isLoading` values in the context
    if(isLoading) return <></>
    return (
        <AuthContext.Provider value={{ currentUser }}>
            {isLoading ? <>Loading ...</> : children}
        </AuthContext.Provider>
    );
};
