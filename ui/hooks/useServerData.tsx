import { useState, useEffect } from "react";
import { IMedia } from "@/components/dashboard/SaveData";

export default function useServerData(
    dataName: "scenes" | "media" | "sources",
    method?: "post" | "get",
    body?: any
) {
    const [isLoading, setLoading] = useState(true);
    const [isError, setError] = useState(false);
    const [data, setData] = useState<any>();

    useEffect(() => {
        fetch(`http://localhost:8080/${dataName}`, {
            method: method || "get",
            body,
        })
            .then((res) => {
                res.json().then((data: any) => {
                    setLoading(false);
                    setData(data);
                });
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
            });
    }, [body, dataName, method]);

    return [isLoading, isError, data];
}
