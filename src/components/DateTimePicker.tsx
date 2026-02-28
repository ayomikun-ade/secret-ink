"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface DateTimePickerProps {
  date?: Date;
  onDateChange: (date: Date | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

export function DateTimePicker({
  date,
  onDateChange,
  minDate,
  maxDate,
  placeholder = "Pick a date and time",
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date
  );
  const [timeValue, setTimeValue] = React.useState<string>(
    date ? format(date, "HH:mm") : "12:00"
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) {
      setSelectedDate(undefined);
      onDateChange(undefined);
      return;
    }

    // Preserve the time when selecting a new date
    const [hours, minutes] = timeValue.split(":").map(Number);
    newDate.setHours(hours, minutes, 0, 0);

    setSelectedDate(newDate);
    onDateChange(newDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    setTimeValue(time);

    if (selectedDate) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDate = new Date(selectedDate);
      newDate.setHours(hours, minutes, 0, 0);
      setSelectedDate(newDate);
      onDateChange(newDate);
    }
  };

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start text-left font-normal px-5 py-4 h-auto rounded-lg bg-input-bg border-3 border-border-primary hover:border-brand-primary focus:border-brand-primary focus:shadow-brutal transition-all duration-200 text-text-primary hover:bg-input-bg",
              !selectedDate && "text-text-muted"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP 'at' HH:mm")
            ) : (
              <span className="text-text-muted/50">{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-surface border-3 border-border-primary shadow-brutal rounded-xl" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              if (minDate && date < minDate) return true;
              if (maxDate && date > maxDate) return true;
              return false;
            }}
            className="rounded-t-xl"
          />
          <div className="p-4 border-t-3 border-border-primary bg-input-bg rounded-b-xl">
            <label className="text-xs font-bold text-text-secondary mb-2 block uppercase tracking-wider">
              Time
            </label>
            <Input
              type="time"
              value={timeValue}
              onChange={handleTimeChange}
              className="bg-surface border-3 border-border-primary focus:border-brand-primary text-text-primary font-bold rounded-lg px-4 py-3 transition-all duration-200 focus:shadow-brutal"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
