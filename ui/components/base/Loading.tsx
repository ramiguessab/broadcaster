export function Spinner() {
    return (
        <div className="border-4 border-zinc-200 h-8 w-8 border-t-transparent rounded-full animate-spin mx-auto" />
    );
}

export function HorizontalLine() {
    return (
        <div className="bg-zinc-700 w-full h-3 rounded-full relative overflow-clip">
            <div className="h-full bg-zinc-200 w-1/5 absolute rounded-full left-[90%] animate-left-to-right"></div>
        </div>
    );
}
