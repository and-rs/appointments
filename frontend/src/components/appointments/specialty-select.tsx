import { Doctor } from "@/lib/types";
import { Control } from "react-hook-form";
import { z } from "zod";
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
import appointmentsFormSchema from "./appointments-schema";

interface Props {
  data: Doctor[];
  control: Control<z.infer<typeof appointmentsFormSchema>>;
}

export default function SpecialtySelect({ data, control }: Props) {
  return (
    <div className="space-y-2">
      <FormField
        control={control}
        name="specialty"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Especialidad</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full" id="specialty">
                  <SelectValue placeholder="Selecciona una especialidad" />
                </SelectTrigger>
                <SelectContent>
                  {data
                    ?.map((doctor) => doctor.specialty)
                    .filter(
                      (specialty, index, self) =>
                        self.indexOf(specialty) === index,
                    )
                    .map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
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
