"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const components = [
  {
    title: "Customers",
    href: "/customers",
    description: "Create and View Customers Already in the System",
  },
  {
    title: "Categories",
    href: "/categories",
    description: "Create , Delete and View Categories",
  },
  {
    title: "Items",
    href: "/items",
    description: "Create ,Update,Delete and View Items",
  },
  {
    title: "Create Invoive",
    href: "/invoice",
    description: "Click here to create a new invoice",
  },
  {
    title: "View Invoive",
    href: "/view-invoices",
    description: "View all the invoices currently in the System",
  },
  {
    title: "Sales",
    href: "/sales",
    description: "Check and Analys Daily,Monthyl and Yearly Sales",
  },
];

export default function NavMenuForRoutes() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-sarath-orange text-white font-bold">
            Select Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  }
);
ListItem.displayName = "ListItem";
