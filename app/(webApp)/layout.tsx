export default function WebAppLayout({ children }: {children: React.ReactNode }) {
    return (
        <>
            <main className="mx-auto max-w-6xl mt-36">
                {children}
            </main>
        </>
    )
}