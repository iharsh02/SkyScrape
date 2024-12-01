import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input";
import { ParamProps } from "@/types/appNode";
import { useId, useState } from "react";


//need to change the default value add zod validation here too 
export const StringParam = ({ param, value = "", updateNodeparamValue }: ParamProps) => {

  const [internalValue, setInternalValue] = useState(value);


  const id = useId();
  return (
    <div className="space-y-1 p-1 w-full">
      <Label htmlFor={id} className="text-xs flex"
      >{param.name}
        {param.required && <p className="text-red-400 px-2"></p>}</Label>
      <Input
        id={id}
        value={internalValue}
        placeholder="Enter the value"
        onChange={(e) => setInternalValue(e.target.value)}
        onBlur={(e) => updateNodeparamValue(e.target.value)}
        className="text-xs"
      />
      {param.helperText && (<p
        className="text-muted-foreground px-2">
        {param.helperText}
      </p>)}
    </div>
  )
}

