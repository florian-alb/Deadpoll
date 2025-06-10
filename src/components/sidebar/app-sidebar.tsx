"use client";

import * as React from "react";

import { Plus, CircleChevronRight } from "lucide-react";

import { NavMain } from "@/components/sidebar/nav-main";

import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LogoDeadpoll from "../icons/logo-deadpoll";

const data = {
  navMain: [
    {
      title: "Tous mes Polls",
      url: "/dashboard",
      icon: CircleChevronRight,
      isActive: true,
    },
    {
      title: "Créer un Poll",
      url: "/dashboard/poll/new",
      icon: Plus,
      classname: "bg-red-500 text-white hover:bg-red-500/50 hover:text-white",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <LogoDeadpoll className="size-12" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">DeadPoll</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
