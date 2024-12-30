import { ParamProps } from "@/types/appNode";
import { useId } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { getCredentialsOfUsers } from "@/actions/credentials/getCredentialsofUsers";


export const CredentialsParam = ({
  param,
  updateNodeparamValue,
  value
}: ParamProps) => {

  const id = useId();
  const query = useQuery({
    queryKey: ["Credentials-for-users"],
    queryFn: () => getCredentialsOfUsers(),
    refetchInterval: 10000,
  });

  return (
    <div className="flex flex-col gap-1 w-full">
      <Label htmlFor={id} className="text-xs flex">
        {param.name}
        {param.required && <p className="text-red-400 px-2">*</p>}
      </Label>
      <Select onValueChange={(value) => {
        updateNodeparamValue(value)
      }} defaultValue={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Credentials</SelectLabel>
            {query.data?.map(credentials => (
              <SelectItem key={credentials.id} value={credentials.id}>{credentials.name}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
