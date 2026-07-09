"use client";

import { createClient} from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const router = useRouter()

    async function handleLogout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push("/login")
        router.refresh()
    }

    return (
        <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut />
            <span className="hidden md:block">Keluar</span>
        </Button>
    )
}