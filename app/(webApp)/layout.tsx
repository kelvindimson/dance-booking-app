import { Navigation } from "@/components/Navbar";
export default function WebAppLayout({ children }: {children: React.ReactNode }) {
    return (
        <>
            <main className="mx-auto max-w-6xl">
                <Navigation />
                {children}
            </main>
        </>
    )
}