import React from 'react';
import { useController, UseControllerProps, useForm } from 'react-hook-form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'; // Assuming these components are from your UI library
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar'; // Assuming this is your calendar component
import { CalendarIcon } from 'lucide-react'; // Example icon
import { format } from 'date-fns';
import { cn } from '@/lib/utils'; // Utility function for conditional classes

interface DatePickerProps extends UseControllerProps {
    label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ label, control, name, rules }) => {
    const {
        field: { value, onChange },
    } = useController({ name, control, rules });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value ? format(new Date(value), 'PPP') : <span>{label || 'Pick a date'}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="single"
                    selected={value ? new Date(value) : undefined}
                    // Ensure date is not undefined before calling onChange
                    onSelect={(date) => date ? onChange(date) : undefined}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
};


export default DatePicker;
