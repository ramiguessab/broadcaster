import { useState } from "react";

type AddItemFunction<T> = (item: T, place: "start" | "end") => void;
type RemoveItemFunction<T> = (index: number) => void;
type ClearItemsFunction = () => void;

type ArrayHookReturn<T> = [
    T[],
    [AddItemFunction<T>, RemoveItemFunction<T>, ClearItemsFunction]
];

export default function useArray<T>(arr: T[]): ArrayHookReturn<T> {
    const [array, setArray] = useState(arr);

    const addItems: AddItemFunction<T> = (
        item: T,
        place: "start" | "end" = "end"
    ) => {
        if (place === "start") {
            setArray((prev) => [item, ...prev]);
        } else {
            setArray((prev) => [...prev, item]);
        }
    };

    const removeItem = (index: number) => {
        setArray((prev) => [...prev.filter((_, i) => i !== index)]);
    };

    const clearItems = () => {
        setArray([]);
    };

    return [array, [addItems, removeItem, clearItems]];
}
