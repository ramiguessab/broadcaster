import { useRef } from "react";

export default function Stream() {
    const streamRef = useRef<HTMLIFrameElement>(null);

    return (
        <div className="sticky top-4 aspect-video h-[70dvh] mx-auto">
            <iframe
                ref={streamRef}
                className="w-full h-full border-x border-zinc-900"
                src={"http://localhost:3000/stream?preview=true"}
            />
        </div>
    );
}
