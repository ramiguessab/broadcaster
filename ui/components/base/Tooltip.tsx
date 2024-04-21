import {
    Tooltip as Tool,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

export default function Tooltip({
    children,
    tip,
}: {
    children: React.ReactNode;
    tip: string;
}) {
    return (
        <Tool>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent>
                <p className="capitalize">{tip}</p>
            </TooltipContent>
        </Tool>
    );
}
