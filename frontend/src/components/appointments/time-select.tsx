"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, useFormContext } from "react-hook-form";
import { z } from "zod";
import appointmentsFormSchema from "./appointments-schema";

const timeSlots = [
  "9:00",
  "9:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "3:00",
  "3:30",
  "4:00",
  "4:30",
  "5:00",
  "5:30",
];

interface Props {
  control: Control<z.infer<typeof appointmentsFormSchema>>;
}

export default function TimeSelect({ control }: Props) {
  const { getValues } = useFormContext();

  return (
    <FormField
      control={control}
      name="time"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="time">Hora</FormLabel>
          <FormControl>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={!getValues("date")}
            >
              <SelectTrigger className="w-full" id="time">
                <SelectValue
                  placeholder={
                    getValues("date")
                      ? "Selecciona una hora"
                      : "Primero selecciona una fecha"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
