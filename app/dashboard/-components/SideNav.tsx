"use client";

import { Home, LucideFileClock, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function SideNav() {
  const router = useRouter();
  const path = usePathname();

  const MenuList = [
    {
      id: 1,
      name: "Home",
      icon: Home,
      path: "/dashboard/",
    },
    // {
    //   id: 2,
    //   name: "History",
    //   icon: LucideFileClock,
    //   path: "/dashboard/history",
    // },
    // {
    //   id: 3,
    //   name: "Billing",
    //   icon: WalletCards,
    //   path: "/dashboard/billing",
    // },
    {
      id: 4,
      name: "Setting",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  useEffect(() => {
    console.log(path);
  }, [path]);

  return (
    <div className="h-screen relative p-5 shadow-sm border bg-white">
      <div className="p-2 flex justify-center">
        <Image src="/logo.svg" alt="logo" width={120} height={100} priority />
      </div>
      <hr className="my-6 border" />

      <div className="mt-10">
        {MenuList.map((menu) => (
          <div
            key={menu.id}
            className={`flex gap-2 mb-2 p-3 hover:bg-black hover:text-white rounded-lg cursor-pointer items-center ${
              path === menu.path ? "bg-black text-white" : ""
            }`}
            onClick={() => router.push(menu.path)}
          >
            <menu.icon className="h-6 w-6" />
            <h2>{menu.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideNav;