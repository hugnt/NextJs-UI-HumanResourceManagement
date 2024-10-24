import React from 'react';
import Select, { MultiValue } from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

// Định nghĩa phong cách tùy chỉnh cho react-select
const customStyles = {
    control: (provided: any) => ({
        ...provided,
        backgroundColor: '222.2 84% 4.9%',
        color: 'white',
        fontSize: '14px', // Cỡ chữ lớn hơn
    }),
    menu: (provided: any) => ({
        ...provided,
        backgroundColor: '222.2 84% 4.9%',
        color: 'white',
        fontSize: '14px', // Cỡ chữ lớn hơn
    }),
    option: (provided: any, { isFocused, isSelected }: any) => ({
        ...provided,
        backgroundColor: isFocused ? 'var(--bg-card-focus)' : isSelected ? 'var(--bg-card-selected)' : 'var(--bg-card)',
        color: 'white',
        fontSize: '14px', // Cỡ chữ lớn hơn
    }),
    multiValue: (provided: any) => ({
        ...provided,
        backgroundColor: 'var(--bg-card)',
        color: 'white',
        fontSize: '14px', // Cỡ chữ lớn hơn
    }),
    multiValueLabel: (provided: any) => ({
        ...provided,
        color: 'white',
        fontSize: '14px', // Cỡ chữ lớn hơn
    }),
    multiValueRemove: (provided: any) => ({
        ...provided,
        color: 'white',
        fontSize: '14px', // Cỡ chữ lớn hơn
        ':hover': {
            backgroundColor: 'var(--bg-card-hover)',
            color: 'white',
        },
    }),
};

type Value = {
    label: string,
    value: number
}

export default function ReactSelect({ value, onHandleIds, defaultValue }: { value: Value[], onHandleIds: (data: number[]) => void, defaultValue: Value[] }) {
    const HandleIds = (newValue: MultiValue<Value>) => {
        const dataReturn: number[] = Array.from(newValue, (item) => item.value);
        onHandleIds(dataReturn); // Kiểm tra xem giá trị đã chuyển đổi thành số chưa
    };

    return (
        <Select
            defaultValue={defaultValue}
            onChange={(e) => HandleIds(e as MultiValue<Value>)} // casting `e` to MultiValue<Value>
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={value}
            styles={customStyles}
            classNamePrefix="bg-card" // Áp dụng lớp CSS cho các thành phần con
        />
    );
}
