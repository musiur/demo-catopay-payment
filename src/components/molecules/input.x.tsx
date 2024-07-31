/**
 * @author: github.com/musiur
 * date: 29 May, 2024
 *
 * @description Unified & reusable INPUT component
 *
 * @params form, name, type, label, placeholder
 * form: react-hook-form
 * name: input name
 * type: input types
 * placeholder: input placeholder
 */

"use client";
import { useState } from "react";
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
} from "@/components/ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Eye, EyeOff } from "lucide-react";
import clsx from "clsx";
import { T__SelectOption } from "@/lib/types";
import Image from "next/image";

type inputType =
  | "text"
  | "password"
  | "textarea"
  | "select"
  | "date"
  | "number";

const InputX = ({
  form,
  name = "input",
  type = "text",
  label = "Input Field",
  placeholder = "",
  options = [{ label: "Test", value: "test" }],
  disabled = false,
}: {
  form: any;
  name: string;
  type?: inputType;
  label: string;
  placeholder?: string;
  options?: T__SelectOption[];
  disabled?: boolean;
}) => {
  /**
   * State to manage showing password fields input as text or, password
   */
  const [showPass, setShowPass] = useState(false);

  /**
   * All Input fields in an Object Scaffold
   */

  const inputFields = {
    text: (field: any) => (
      <Input placeholder={placeholder} {...field} type={type} />
    ),
    number: (field: any) => (
      <Input
        placeholder={placeholder}
        value={field.value}
        onChange={(e: any) => {
          e.target.value && field.onChange(parseInt(e.target.value));
        }}
        type={type}
        disabled={disabled}
      />
    ),
    textarea: (field: any) => (
      <Textarea
        placeholder={placeholder}
        {...field}
        type={type}
        rows="4"
        disabled={disabled}
      />
    ),
    password: (field: any) => (
      <div className="relative">
        <Input
          placeholder={placeholder}
          {...field}
          type={!showPass ? type : "text"}
          disabled={disabled}
        />
        <div
          className="inline-flex w-8 h-8 items-center justify-center absolute top-[2px] right-2"
          role="button"
          onClick={() => setShowPass(!showPass)}
        >
          <Eye
            className={clsx(
              "h-4 text-gray-400 dark:text-gray-500 transition-all duration-300",
              {
                "opacity-100 w-4": showPass,
                "opacity-0 w-0": !showPass,
              }
            )}
          />
          <EyeOff
            className={clsx(
              "h-4 text-gray-400 dark:text-gray-500 transition-all duration-300",
              {
                "opacity-100 w-4": !showPass,
                "opacity-0 w-0": showPass,
              }
            )}
          />
        </div>
      </div>
    ),
    select: (field: any) => (
      <Select
        onValueChange={field.onChange}
        defaultValue={field.value}
        disabled={disabled}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {options?.length
            ? options?.map((option: T__SelectOption) => {
                const { value, label } = option;
                return (
                  <SelectItem key={value} value={value}>
                    <div className="flex items-center space-x-2 py-[4px]">
                      {option?.image ? (
                        <Image
                          src={option.image}
                          alt=""
                          width={500}
                          height={500}
                          className="h-[32px] w-[32px] rounded-full"
                        />
                      ) : null}
                      <div className="inline-flex justify-between gap-2">
                        <p>{label}</p>
                        {option?.subLabel ? (
                          <p className="opacity-60">{option.subLabel}</p>
                        ) : null}
                      </div>
                    </div>
                  </SelectItem>
                );
              })
            : null}
        </SelectContent>
      </Select>
    ),
  };
  return (
    <FormField
      control={form.control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {
              // @ts-ignore
              inputFields[type](field)
            }
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputX;
