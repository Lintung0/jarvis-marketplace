import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"
import AdSlot from "@/components/shared/AdSlot"

export default function MainLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
        <Navbar />
        <AdSlot placement="header" />
        <main className="min-h-screen">{children}</main>
        <AdSlot placement="footer" />
        <Footer />
        </>
    )
}