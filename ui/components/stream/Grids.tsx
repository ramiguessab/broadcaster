import { v4 as uuid } from "uuid";
import { useSearchParams } from "next/navigation";
import { Reorder } from "framer-motion";
import { GetCameraById, GetCaptureById } from "@/lib/getById";
import useCameraCacheStore from "@/hooks/states/camerasCache";
import { memo, useState, forwardRef, Ref } from "react";
import { IMedia } from "../dashboard/SaveData";

type Source = "camera" | "video" | "image" | "pdf" | "empty";
export type GridPlacement =
    | "top_right"
    | "top_center"
    | "top_left"
    | "middle_right"
    | "middle_center"
    | "middle_left"
    | "bottom_right"
    | "bottom_center"
    | "bottom_left";

export interface ElementPosition {
    placement: GridPlacement;
    offsetLeft: number;
    offsetRight: number;
    scale: number;
}

export interface IGridElement {
    id: string;
    type: Source;
    url: string;
    placement: IMedia["placement"];
}

interface IGridBaseProps {
    elements: IGridElement[];
    inversed?: boolean;
}

interface IGridElementProp {
    element: IGridElement;
}

const createEmptyElement: () => IGridElement = () => ({
    id: uuid(),
    type: "empty",
    url: uuid(),
    placement: {
        offset: { x: 0, y: 0 },
        position: "inside",
        scale: 1,
        aspectRatio: "1/1",
        placement: "top left",
    },
});

function GridElementRef({ element }: IGridElementProp, ref: Ref<any>) {
    const type = element.type;

    if (type === "empty") {
        return <div />;
    }
    if (type === "camera" || type === "video") {
        return (
            <video
                className="h-full w-full"
                style={
                    element.placement.position === "outside"
                        ? {
                              aspectRatio: element.placement.aspectRatio,
                              scale: element.placement.scale,
                              translate: `${element.placement.offset.x}% ${element.placement.offset.y}%`,
                          }
                        : {}
                }
                ref={(ref) => {
                    if (type === "camera" && ref !== null) {
                        GetCameraById(element.url).then((stream) => {
                            if (stream) {
                                ref.srcObject = stream;
                            }
                        });
                    }
                }}
                autoPlay
                muted
            >
                <source src={element.url} />
            </video>
        );
    } else if (type === "image") {
        return (
            <div className="w-fit h-fit" ref={ref}>
                <img
                    className="h-full w-full"
                    src={element.url}
                    style={
                        element.placement.position === "outside"
                            ? {
                                  aspectRatio: element.placement.aspectRatio,
                                  scale: element.placement.scale,
                                  translate: `${element.placement.offset.x}% ${element.placement.offset.y}%`,
                              }
                            : {}
                    }
                />
            </div>
        );
    } else if (type === "pdf") {
        return (
            <iframe
                src={element.url}
                className="h-full w-full aspect-video"
                style={
                    element.placement.position === "outside"
                        ? {
                              aspectRatio: element.placement.aspectRatio,
                              scale: element.placement.scale,
                              translate: `${element.placement.offset.x}% ${element.placement.offset.y}%`,
                          }
                        : {}
                }
            />
        );
    }
}
export const GridElementBase = memo(forwardRef(GridElementRef));

export const GridElement = (props: IGridElementProp) => {
    return <GridElementBase {...props} />;
};

export function Grid1({ elements }: IGridBaseProps) {
    const full_screen = elements[0];
    return (
        <div className="grid grid-cols-1 grid-rows-1 h-screen">
            <GridElement element={full_screen} />
        </div>
    );
}

export function Grid2({ inversed = false, elements }: IGridBaseProps) {
    if (!inversed) {
        return <Grid2Side elements={elements} />;
    } else {
        return <Grid2Top elements={elements} />;
    }
}

export function Grid3({ elements }: IGridBaseProps) {
    return (
        <div className="grid grid-cols-2 grid-rows-1 h-screen">
            <div className="my-auto">
                <GridElement element={elements[0]} />
            </div>
            <div className="grid grid-cols-1 grid-rows-2">
                <GridElement element={elements[1]} />

                <GridElement element={elements[2]} />
            </div>
        </div>
    );
}

export function Grid4({ elements }: IGridBaseProps) {
    return (
        <div className="grid grid-cols-2 grid-rows-2 h-screen">
            <GridElement element={elements[0]} />
            <GridElement element={elements[1]} />
            <GridElement element={elements[2]} />
            <GridElement element={elements[3]} />
        </div>
    );
}

export function Grid5({ elements }: IGridBaseProps) {
    return (
        <div className="grid grid-cols-3 grid-rows-1 h-screen">
            <div className="my-auto">
                <GridElement element={elements[0]} />
            </div>

            <div className="grid grid-cols-2 grid-rows-2 col-span-2 h-full">
                <div className="my-auto">
                    <GridElement element={elements[1]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[2]} />
                </div>

                <div className="my-auto">
                    <GridElement element={elements[3]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[4]} />
                </div>
            </div>
        </div>
    );
}

export function Grid6({ elements }: IGridBaseProps) {
    return (
        <div className="grid grid-cols-3 grid-rows-2 h-screen">
            {elements.map((element) => (
                <div key={element.url} className="my-auto">
                    <GridElement element={element} />
                </div>
            ))}
        </div>
    );
}

export function Grid7({ elements }: IGridBaseProps) {
    return (
        <div className="grid grid-cols-3 grid-rows-1 h-screen">
            <div className="grid grid-cols-1 grid-rows-3">
                <div className="my-auto">
                    <GridElement element={elements[0]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[1]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[2]} />
                </div>
            </div>

            <div className="grid grid-cols-2 grid-rows-2 col-span-2">
                <div className="my-auto">
                    <GridElement element={elements[3]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[4]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[5]} />
                </div>
                <div className="my-auto">
                    <GridElement element={elements[6]} />
                </div>
            </div>
        </div>
    );
}

export function Grid8({ elements }: IGridBaseProps) {
    return (
        <Grid9
            elements={[
                ...elements.slice(0, 4),
                createEmptyElement(),
                ...elements.slice(4),
            ]}
        />
    );
}

interface IGrid9Props extends IGridBaseProps {
    absolute?: boolean;
}

export function Grid9({ absolute = false, elements }: IGrid9Props) {
    return (
        <div className="grid grid-cols-3 grid-rows-3 h-screen">
            {elements.map((element) => (
                <GridElement key={element.url} element={element} />
            ))}
        </div>
    );
}

const getElementAtPlace = (
    elements: IGrid9Props["elements"],
    placement: IMedia["placement"]["placement"]
) => {
    return (
        elements.find((elm) => elm.placement.placement === placement) ||
        createEmptyElement()
    );
};

export function OutterGrid({
    elements,
}: {
    elements: IGrid9Props["elements"];
}) {
    const gridElements = [
        getElementAtPlace(elements, "top left"),
        getElementAtPlace(elements, "top center"),
        getElementAtPlace(elements, "top right"),
        getElementAtPlace(elements, "middle left"),
        getElementAtPlace(elements, "middle center"),
        getElementAtPlace(elements, "middle right"),
        getElementAtPlace(elements, "bottom left"),
        getElementAtPlace(elements, "bottom center"),
        getElementAtPlace(elements, "bottom right"),
    ];

    return (
        <div className="w-screen absolute grid grid-cols-3 grid-rows-3 top-0 max-h-screen">
            {gridElements.map((element) => (
                <GridElement key={element.url} element={element} />
            ))}
        </div>
    );
}

function Grid2Top({ elements }: IGridBaseProps) {
    return (
        <div className="grid grid-cols-1 grid-rows-2 h-screen">
            {elements.map((element) => (
                <GridElement key={element.url} element={element} />
            ))}
        </div>
    );
}

function Grid2Side({ elements }: IGridBaseProps) {
    const [elms, setElms] = useState(["blue", "red"]);
    return (
        <Reorder.Group
            values={elms}
            onReorder={setElms}
            as="div"
            className="grid grid-cols-2 grid-rows-1 h-screen"
        >
            {elements.map((element) => (
                <div key={element.url} className="my-auto">
                    <GridElement element={element} />
                </div>
            ))}
        </Reorder.Group>
    );
}
