import { Ref } from "react";
import {
    Select as Sel,
    SelectTrigger,
    SelectGroup,
    SelectLabel,
    SelectItem,
    SelectContent,
    SelectValue,
} from "../ui/select";
import { forwardRef } from "react";

export interface IItem {
    label: string;
    values: string[] | { value: string; displayName: string }[];
}

interface ISelect {
    items: IItem[];
    placeholder: string;
    defaultValue: string;
    disabled?: boolean;
    onChange: (value: string) => void;
}

function SelectRef(
    { items, placeholder, defaultValue, disabled, ...props }: ISelect,
    ref: Ref<HTMLDivElement>
) {
    return (
        <Sel
            defaultValue={defaultValue}
            onValueChange={props.onChange}
            disabled={disabled}
        >
            <SelectTrigger className="dark:text-white capitalize dark:border-zinc-900">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent ref={ref}>
                {items.map((item) => (
                    <SelectGroup key={item.label}>
                        {item.label && (
                            <SelectLabel className="capitalize">
                                {item.label}
                            </SelectLabel>
                        )}

                        {item.values.length === 0 && (
                            <SelectItem
                                value={`no ${item.label ? item.label : ""}`}
                                disabled
                                className="capitalize"
                            >
                                no {item.label}
                            </SelectItem>
                        )}

                        {item.values.map((value) => {
                            if (typeof value === "string") {
                                return (
                                    <SelectItem
                                        key={value}
                                        value={value}
                                        className="capitalize"
                                    >
                                        {value.split("_").join(" ")}
                                    </SelectItem>
                                );
                            } else {
                                return (
                                    <SelectItem
                                        key={value.value}
                                        value={value.value}
                                        className="capitalize"
                                    >
                                        {value.displayName}
                                    </SelectItem>
                                );
                            }
                        })}
                    </SelectGroup>
                ))}
            </SelectContent>
        </Sel>
    );
}

const Select = forwardRef(SelectRef);

export default Select;
