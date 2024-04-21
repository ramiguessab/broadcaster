import { useState, useEffect } from "react";

const getWindowSize = () => ({
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
});
export default function useWindowSize() {
    const [size, setSize] = useState(getWindowSize());

    useEffect(() => {
        function resizeHandler() {
            setSize(getWindowSize());
        }

        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler);
        };
    }, []);

    return size;
}
