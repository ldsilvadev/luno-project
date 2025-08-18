"use client";

import { Avatar } from "@/components";
import { useAuth } from "@/modules";
import {
  ChevronFirst,
  ChevronLast,
  MoreVertical,
  LayoutDashboard,
  AppWindowMac,
  Settings,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarItemProps {
  icon: React.ElementType;
  text: string;
  href: string;
  active?: boolean;
  expanded: boolean;
}

function SidebarItem({
  icon: Icon,
  text,
  href,
  active,
  expanded,
}: SidebarItemProps) {
  return (
    <Link href={href}>
      <li
        className={`
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            active
              ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-primary"
              : "hover:bg-foreground text-foreground hover:text-primary"
          }
        `}
      >
        <Icon size={20} />
        <span
          className={`overflow-hidden transition-all ${
            expanded ? "w-52 ml-3" : "w-0"
          }`}
        >
          {text}
        </span>
        {!expanded && (
          <div
            className={`
              absolute left-full rounded-md px-2 py-1 ml-6
              bg-indigo-100 text-indigo-800 text-sm
              invisible opacity-20 -translate-x-3 transition-all
              group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
            `}
          >
            {text}
          </div>
        )}
      </li>
    </Link>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setExpanded(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      text: "Dashboard",
      href: "/dashboard",
    },
    {
      icon: AppWindowMac,
      text: "Projetos",
      href: "/projetos",
    },
  ];

  return (
    <aside
      className={`h-screen fixed left-0 top-0 z-50 transition-all duration-300 ${
        expanded ? "w-64" : "w-16"
      }`}
    >
      <nav className="h-full flex flex-col bg-primary border-r shadow-lg">
        <div className="p-4 pb-2 flex justify-between items-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={120}
            height={80}
            className={`overflow-hidden transition-all ${
              expanded ? "w-16 h-6" : "w-0"
            }`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-background hover:bg-background/80"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3">
          {menuItems.map((item) => (
            <SidebarItem
              key={item.href}
              icon={item.icon}
              text={item.text}
              href={item.href}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              expanded={expanded}
            />
          ))}
        </ul>

        <div className="border-t flex p-3">
          <div className="flex-shrink-0">
            <Avatar userName={user?.user_name} />
          </div>
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
            `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{user?.user_name}</h4>
              <span className="text-xs text-gray-600">{user?.email}</span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 rounded-md hover:bg-gray-100">
                  <MoreVertical size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </aside>
  );
}
