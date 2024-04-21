import "./globals.css";
import type { Metadata } from "next";
import { plus_jakarta_sans as font } from "@/public/font";
import Models from "@/components/dashboard/Models";
import Messages from "@/components/dashboard/Messages";

export const metadata: Metadata = {
    icons: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWNsYXBwZXJib2FyZCI+PHBhdGggZD0iTTIwLjIgNiAzIDExbC0uOS0yLjRjLS4zLTEuMS4zLTIuMiAxLjMtMi41bDEzLjUtNGMxLjEtLjMgMi4yLjMgMi41IDEuM1oiLz48cGF0aCBkPSJtNi4yIDUuMyAzLjEgMy45Ii8+PHBhdGggZD0ibTEyLjQgMy40IDMuMSA0Ii8+PHBhdGggZD0iTTMgMTFoMTh2OGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMloiLz48L3N2Zz4=",
    title: "Broadcaster",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={font.className + " font-sans bg-zinc-950"}>
                <Messages />
                <Models />
                {children}
            </body>
        </html>
    );
}
