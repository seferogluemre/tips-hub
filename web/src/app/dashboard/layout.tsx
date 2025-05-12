"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuthRedirect } from "@/hooks/use-auth-redirect";
import { useLogout } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { Home, ListChecks, LogOut, Plus, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogout();

  useAuthRedirect({ redirectUnauthenticatedTo: "/login" });

  const navItems = [
    {
      name: "Ana Sayfa",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Tip Oluştur",
      href: "/dashboard/create-tip",
      icon: Plus,
    },
    {
      name: "Tipleri İncele",
      href: "/dashboard/tips",
      icon: ListChecks,
    },
    {
      name: "Profil",
      href: "/dashboard/profile",
      icon: User,
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
    });
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-background border-r flex flex-col h-full">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">İpuçları</h1>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item?.href}>
                  <Link href={item?.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-2",
                        isActive ? "font-medium" : "font-normal"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item?.name}
                    </Button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Tema</span>
            <ThemeToggle />
          </div>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
          >
            <LogOut className="h-4 w-4" />
            {logoutMutation.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
