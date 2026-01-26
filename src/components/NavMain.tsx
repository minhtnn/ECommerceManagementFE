import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
  content,
}: {
  content: {
    mainTitle: string;
    items: {
      title: string;
      url: string;
      icon?: any;
      isActive?: boolean;
    }[];
  };
}) {
  const { open, toggleSidebar } = useSidebar();
  const pathname = useLocation().pathname;
  //console.log( "NavMain: ", ( '/' + pathname.replace( /^\//, '' ).split( '/' ).slice( 0, 2 ).join( '/' ) ) );
  const checkIsActive = (itemUrl: string) => {
    const normalizedPath =
      "/" + pathname.replace(/^\//, "").split("/").slice(0, 3).join("/");
    return normalizedPath === itemUrl;
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="mb-1 font-semibold text-primary">
        {content.mainTitle}
      </SidebarGroupLabel>
      <SidebarMenu>
        {content.items.map((item) => {
          const isActive = checkIsActive(item.url);
          return (
            <SidebarMenuItem
              key={item.title}
              onClick={open ? undefined : toggleSidebar}
            >
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary font-medium border-l-4 border-primary"
                    : "text-foreground"
                )}
              >
                <Link to={item.url}>
                  {item.icon && (
                    <item.icon
                      className={cn(
                        isActive
                          ? "text-primary font-medium"
                          : "text-foreground"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "flex items-center gap-2",
                      isActive ? "text-primary font-medium" : "text-foreground"
                    )}
                  >
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
