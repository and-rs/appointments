import { Doctor } from "@/lib/types";
import { Control, useWatch } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import appointmentsFormSchema from "./appointments-schema";

interface Props {
  data: Doctor[];
  control: Control<z.infer<typeof appointmentsFormSchema>>;
}

export default function DoctorSelect({ data, control }: Props) {
  const selectedSpecialty = useWatch({ control, name: "specialty" });

  const filteredDoctors = selectedSpecialty
    ? data.filter((doctor) => doctor.specialty === selectedSpecialty)
    : data;

  return (
    <div className="space-y-2">
      <FormField
        control={control}
        name="doctor"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Doctor</FormLabel>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={!selectedSpecialty}
              >
                <SelectTrigger className="w-full" id="doctor">
                  <SelectValue
                    placeholder={
                      selectedSpecialty
                        ? "Selecciona un doctor"
                        : "Primero selecciona una especialidad"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {filteredDoctors?.map((doctor) => (
                    <SelectItem key={doctor.id} value={doctor.id.toString()}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
