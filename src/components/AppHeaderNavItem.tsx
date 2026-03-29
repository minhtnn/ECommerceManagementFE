import { useCartContext } from "@/contexts/CartContext";
import { useTheme } from "@/providers/theme-provider";
import { handleChangeHeaderMenuOpenWhenChangingMobile } from "@/redux/modal/modal-slice";
import { RootState } from "@/redux/store";
import { PATH_AUTH, PATH_END_CUSTOMER, PATH_GUEST } from "@/routes/path";
import { ERole } from "@/types/enums/role.enum";
import {
  AlignJustify,
  ChevronDown,
  Mail,
  Moon,
  Phone,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavChild = {
  key: string;
  title: string;
  url: string;
  preload?: () => Promise<any>;
};

type NavRoute = NavChild & {
  children?: NavChild[];
};

// ---------------------------------------------------------------------------
// Route definitions — single source of truth
// ---------------------------------------------------------------------------

const NAV_ROUTES: NavRoute[] = [
  {
    key: "home",
    title: "Trang chủ",
    url: PATH_GUEST.home.root,
    preload: () => import("@/pages/guest/home"),
  },
  {
    key: "product",
    title: "Sản phẩm",
    url: PATH_GUEST.products.root,
    preload: () => import("@/pages/guest/products/list"),
  },
  {
    key: "introduce",
    title: "Giới thiệu",
    url: PATH_GUEST.introduce.root,
    preload: () => import("@/pages/guest/introduction"),
  },
  {
    key: "service",
    title: "Dịch vụ",
    url: PATH_GUEST.services.root,
    preload: () => import("@/pages/guest/service/green-coffee"),
    children: [
      {
        key: "greenCoffee",
        title: "Cà phê nhân xanh",
        url: PATH_GUEST.services.greenCoffee,
        preload: () => import("@/pages/guest/service/green-coffee"),
      },
      {
        key: "roastedCoffee",
        title: "Cà phê rang",
        url: PATH_GUEST.services.roastedCoffee,
        preload: () => import("@/pages/guest/service/roasted-coffee"),
      },
    ],
  },
  {
    key: "news",
    title: "Tin tức",
    url: PATH_GUEST.news.root,
    preload: () => import("@/pages/guest/news/list"),
  },
  {
    key: "contact",
    title: "Liên hệ",
    url: PATH_GUEST.contact.root,
    preload: () => import("@/pages/guest/contact"),
  },
];

// ---------------------------------------------------------------------------
// Helper — resolve active key
// ---------------------------------------------------------------------------

function resolveActiveKey(pathname: string): string {
  for (const route of NAV_ROUTES) {
    if (route.children) {
      const childMatch = route.children.some(
        (c) => pathname === c.url || pathname.startsWith(c.url),
      );
      if (
        childMatch ||
        pathname === route.url ||
        pathname.startsWith(route.url + "/")
      ) {
        return route.key;
      }
    } else if (pathname === route.url || pathname.startsWith(route.url)) {
      return route.key;
    }
  }
  return "";
}

// ---------------------------------------------------------------------------
// Desktop NavItem — underline slide animation
// ---------------------------------------------------------------------------

type NavItemProps = {
  route: NavRoute;
  isActive: boolean;
  onClick: () => void;
};

function DesktopNavItem({ route, isActive, onClick }: NavItemProps) {
  return (
    <button
      onMouseEnter={() => route.preload?.()}
      onClick={onClick}
      className="relative group py-1 text-base font-medium tracking-wide transition-colors duration-200"
      style={{
        color: isActive
          ? "hsl(var(--primary))"
          : "hsl(var(--foreground) / 0.65)",
      }}
    >
      <span className="relative z-10 group-hover:text-foreground transition-colors duration-200">
        {route.title}
      </span>
      {/* Animated underline */}
      <span
        className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ease-out"
        style={{
          width: isActive ? "100%" : "0%",
          backgroundColor: "hsl(var(--primary))",
          transformOrigin: "left",
        }}
      />
      <span
        className="absolute bottom-0 left-0 h-[2px] rounded-full w-0 group-hover:w-full transition-all duration-300 ease-out opacity-40"
        style={{ backgroundColor: "hsl(var(--primary))" }}
      />
    </button>
  );
}

// ---------------------------------------------------------------------------
// Desktop Dropdown NavItem — refined popover
// ---------------------------------------------------------------------------

type DropdownNavItemProps = {
  route: NavRoute;
  isActive: boolean;
  onChildClick: (url: string) => void;
};

function DesktopDropdownNavItem({
  route,
  isActive,
  onChildClick,
}: DropdownNavItemProps) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleMouseEnter() {
    if (timer.current) clearTimeout(timer.current);
    route.preload?.();
    setOpen(true);
  }

  function handleMouseLeave() {
    timer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="relative group flex items-center gap-1 py-1 text-base font-medium tracking-wide transition-colors duration-200"
        style={{
          color: isActive
            ? "hsl(var(--primary))"
            : "hsl(var(--foreground) / 0.65)",
        }}
      >
        <span className="group-hover:text-foreground transition-colors duration-200">
          {route.title}
        </span>
        <ChevronDown
          size={13}
          className="transition-transform duration-300 ease-out"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
        {/* Active underline */}
        <span
          className="absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-300 ease-out"
          style={{
            width: isActive ? "calc(100% - 17px)" : "0%",
            backgroundColor: "hsl(var(--primary))",
          }}
        />
        <span
          className="absolute bottom-0 left-0 h-[2px] rounded-full w-0 group-hover:w-[calc(100%-17px)] transition-all duration-300 ease-out opacity-40"
          style={{ backgroundColor: "hsl(var(--primary))" }}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-52 rounded-xl border border-border/60 bg-background/95 backdrop-blur-md shadow-xl shadow-black/10 overflow-hidden z-50"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.97)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Top accent line */}
        <div
          className="h-[2px] w-full"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--primary) / 0.3))" }}
        />
        <div className="py-1.5">
          {route.children?.map((child, i) => (
            <button
              key={child.key}
              onMouseEnter={() => child.preload?.()}
              onClick={() => {
                onChildClick(child.url);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-base text-foreground/70 hover:text-foreground hover:bg-muted/60 transition-all duration-150 flex items-center gap-2.5 group/item"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {/* Dot indicator */}
              <span
                className="w-1 h-1 rounded-full flex-shrink-0 transition-all duration-200"
                style={{
                  background: "hsl(var(--primary) / 0.4)",
                  transform: "scale(0.8)",
                }}
              />
              {child.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Overlay — full-screen cinematic wipe
// ---------------------------------------------------------------------------

const DIVIDER_BEFORE: Record<string, boolean> = {
  service: true,
  news: true,
};

type MobileOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  activeKey: string;
  pathname: string;
  onNavigate: (url: string) => void;
};

function MobileOverlay({
  isOpen,
  onClose,
  activeKey,
  pathname,
  onNavigate,
}: MobileOverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<"hidden" | "entering" | "visible" | "leaving">("hidden");
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const mountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setPhase("entering");
      mountTimer.current = setTimeout(() => setPhase("visible"), 16);
    } else {
      setPhase("leaving");
      phaseTimer.current = setTimeout(() => {
        setPhase("hidden");
        setMounted(false);
        setExpandedKey(null);
      }, 540);
    }
    return () => {
      if (mountTimer.current) clearTimeout(mountTimer.current);
      if (phaseTimer.current) clearTimeout(phaseTimer.current);
    };
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!mounted) return null;

  const visible = phase === "visible";
  const EASE_IN  = "cubic-bezier(0.76, 0, 0.24, 1)";
  const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";
  const clipEase = visible ? EASE_OUT : EASE_IN;
  const clipDur  = visible ? "0.58s" : "0.48s";

  return (
    <div
      className="fixed inset-0 z-[200] lg:hidden flex flex-col"
      style={{
        background: "hsl(var(--background))",
        clipPath: visible
          ? "circle(170% at 2.5rem 3.5rem)"
          : "circle(0% at 2.5rem 3.5rem)",
        transition: `clip-path ${clipDur} ${clipEase}`,
        willChange: "clip-path",
      }}
    >
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.6s ease 0.15s",
        }}
      />

      {/* ── Top bar ── */}
      <div
        className="relative flex items-center justify-between px-5 shrink-0 border-b border-border/20"
        style={{ height: "4rem" }}
      >
        <Link
          to="/"
          onClick={onClose}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateX(0)" : "translateX(-14px)",
            transition: `opacity 0.4s ease 0.2s, transform 0.4s ${EASE_OUT} 0.2s`,
          }}
        >
          <img
            src="/UniCoffeeRoastery.png"
            alt="UniCoffeeRoastery"
            className="h-8 w-auto"
          />
        </Link>

        <button
          onClick={onClose}
          aria-label="Đóng menu"
          className="p-2 rounded-xl text-foreground/50 hover:text-foreground hover:bg-muted/60 transition-all duration-200"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.6)",
            transition: `opacity 0.35s ease 0.18s, transform 0.42s ${EASE_OUT} 0.16s`,
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* ── MENU watermark ── */}
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="font-bold uppercase tracking-[0.18em] text-foreground text-8xl leading-none"
          style={{
            // fontSize: "clamp(5rem, 32vw, 10rem)",
            opacity: visible ? 0.04 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(1.1) translateY(4%)",
            transition: `opacity 0.7s ease 0.06s, transform 0.7s ${EASE_OUT} 0.06s`,
          }}
        >
          MENU
        </span>
      </div>

      {/* ── Nav items ── */}
      <nav className="relative flex-1 flex flex-col items-center justify-center overflow-y-auto px-8 py-6">
        {NAV_ROUTES.map((route, index) => {
          const isActive = activeKey === route.key;
          const isExpanded = expandedKey === route.key;
          const stagger = `${0.18 + index * 0.065}s`;

          return (
            <div key={route.key} className="w-full flex flex-col items-center">
              {/* Divider */}
              {DIVIDER_BEFORE[route.key] && (
                <div
                  style={{
                    width: "2rem",
                    height: "1px",
                    background:
                      "linear-gradient(90deg, transparent, hsl(var(--border) / 0.5), transparent)",
                    margin: "0.55rem 0",
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.4s ease ${stagger}`,
                  }}
                />
              )}

              {route.children ? (
                <>
                  {/* Accordion trigger */}
                  <button
                    onClick={() => setExpandedKey(isExpanded ? null : route.key)}
                    className="flex items-center gap-2 py-2.5 w-full justify-center group/acc"
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? "translateY(0)" : "translateY(20px)",
                      transition: `opacity 0.5s ease ${stagger}, transform 0.5s ${EASE_OUT} ${stagger}`,
                      fontSize: "clamp(1.3rem, 5vw, 1.65rem)",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      color: isActive
                        ? "hsl(var(--primary))"
                        : "hsl(var(--foreground) / 0.32)",
                    }}
                  >
                    <span
                      className="transition-colors duration-200 group-hover/acc:text-foreground"
                      style={{ color: "inherit" }}
                    >
                      {route.title}
                    </span>
                    <ChevronDown
                      size={15}
                      className="flex-shrink-0 mt-0.5"
                      style={{
                        color: "hsl(var(--foreground) / 0.2)",
                        transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1)",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </button>

                  {/* Accordion children */}
                  <div
                    className="w-full flex flex-col items-center overflow-hidden"
                    style={{
                      maxHeight: isExpanded ? "12rem" : "0",
                      opacity: isExpanded ? 1 : 0,
                      transition:
                        "max-height 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.3s ease",
                    }}
                  >
                    <div
                      className="flex flex-col items-center gap-0 pt-0.5 pb-1"
                      style={{
                        borderLeft: "1.5px solid hsl(var(--primary) / 0.2)",
                        paddingLeft: "1.1rem",
                      }}
                    >
                      {route.children.map((child) => {
                        const childActive = pathname === child.url;
                        return (
                          <button
                            key={child.key}
                            onClick={() => onNavigate(child.url)}
                            className="py-2 text-[0.95rem] tracking-wide"
                            style={{
                              color: childActive
                                ? "hsl(var(--primary))"
                                : "hsl(var(--muted-foreground))",
                              fontWeight: childActive ? 500 : 400,
                              transition: "color 0.15s ease, opacity 0.15s ease",
                            }}
                            onMouseEnter={(e) =>
                              ((e.currentTarget as HTMLButtonElement).style.opacity = "0.65")
                            }
                            onMouseLeave={(e) =>
                              ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                            }
                          >
                            {child.title}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <button
                  onMouseEnter={(e) => {
                    route.preload?.();
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "hsl(var(--foreground) / 0.65)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground) / 0.32)";
                  }}
                  onClick={() => onNavigate(route.url)}
                  className="py-2.5 w-full text-center"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.5s ease ${stagger}, transform 0.5s ${EASE_OUT} ${stagger}, color 0.2s ease`,
                    fontSize: "clamp(1.3rem, 5vw, 1.65rem)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: isActive
                      ? "hsl(var(--primary))"
                      : "hsl(var(--foreground) / 0.32)",
                  }}
                >
                  {route.title}
                </button>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Footer ── */}
      <div
        className="relative px-8 py-5 shrink-0"
        style={{
          borderTop: "1px solid hsl(var(--border) / 0.2)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
          transition: `opacity 0.5s ease 0.4s, transform 0.5s ${EASE_OUT} 0.4s`,
        }}
      >
        <div className="flex items-center gap-6">
          <a
            href="tel:0909429323"
            className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            <Phone size={13} />
            <span>0909.429.323</span>
          </a>
          <a
            href="mailto:unicoffeeroasteryvn@gmail.com"
            className="flex items-center gap-2 text-base text-muted-foreground hover:text-foreground transition-colors duration-200 min-w-0 truncate"
          >
            <Mail size={13} className="flex-shrink-0" />
            <span className="truncate">unicoffeeroasteryvn@gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function AppEndUserHeader({
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const { isHeaderMenuOpenWhenChangingMobile } = useSelector(
    (state: RootState) => state.modal,
  );
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { isAuthenticated, user, role } = useSelector(
    (state: RootState) => state.user,
  );
  const { theme, setTheme } = useTheme();

  // Scroll-aware header shadow
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const actualTheme =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;

  const accountLink = isAuthenticated ? PATH_AUTH.account : PATH_AUTH.root;
  const isEndCustomer = isAuthenticated && role === ERole.EndCustomer;

  const activeKey = useMemo(
    () => resolveActiveKey(location.pathname),
    [location.pathname],
  );

  const { cartData } = useCartContext();
  const cart = cartData?.data?.data;
  const totalItems =
    cart?.items
      ?.filter((item) => !item.isGiftItem)
      .reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  function handleNavClick(url: string) {
    navigate(url);
    if (isHeaderMenuOpenWhenChangingMobile) {
      dispatch(handleChangeHeaderMenuOpenWhenChangingMobile(false));
    }
  }

  return (
    <header
      className="bg-background sticky top-0 z-50 transition-shadow duration-300"
      style={{
        boxShadow: scrolled
          ? "0 1px 24px hsl(var(--foreground) / 0.07), 0 1px 3px hsl(var(--foreground) / 0.04)"
          : "0 1px 0 hsl(var(--border) / 0.6)",
      }}
      {...props}
    >
      {/* ── Top bar ── */}
      <div
        className="text-primary-foreground py-1.5 text-xs overflow-hidden"
        style={{ background: "hsl(var(--primary))" }}
      >
        <div className="container mx-auto flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline font-medium opacity-80">Cần hỗ trợ?</span>
            <a
              href="tel:0909429323"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-200"
            >
              <Phone size={12} />
              <span>0909.429.323</span>
            </a>
            <a
              href="mailto:unicoffeeroasteryvn@gmail.com"
              className="hidden md:flex items-center gap-1.5 hover:opacity-80 transition-opacity duration-200"
            >
              <Mail size={12} />
              <span>unicoffeeroasteryvn@gmail.com</span>
            </a>
          </div>
          {/* Marquee-style text on mobile, static on desktop */}
          <div className="font-semibold tracking-widest text-[10px] opacity-90 animate-pulse hidden sm:block">
            UỐNG UNI COFFEE TẠI NHÀ !
          </div>
          <div className="font-semibold tracking-wider text-[10px] opacity-90 sm:hidden">
            UNI COFFEE
          </div>
        </div>
      </div>

      {/* ── Logo + actions row ── */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-4 py-1.5">
          {/* Mobile menu toggle */}
          <button
            className="lg:hidden flex flex-col items-center gap-0.5 p-2 rounded-xl hover:bg-muted/70 transition-all duration-200 active:scale-95"
            onClick={() =>
              dispatch(
                handleChangeHeaderMenuOpenWhenChangingMobile(
                  !isHeaderMenuOpenWhenChangingMobile,
                ),
              )
            }
            aria-label="Toggle menu"
          >
            <span
              className="transition-all duration-300"
              style={{
                opacity: isHeaderMenuOpenWhenChangingMobile ? 0 : 1,
                transform: isHeaderMenuOpenWhenChangingMobile
                  ? "scale(0.7) rotate(90deg)"
                  : "scale(1) rotate(0deg)",
                position: isHeaderMenuOpenWhenChangingMobile ? "absolute" : "relative",
              }}
            >
              <AlignJustify size={22} />
            </span>
            {isHeaderMenuOpenWhenChangingMobile && (
              <span
                style={{
                  opacity: 1,
                  transform: "scale(1) rotate(0deg)",
                  transition: "all 0.25s ease",
                }}
              >
                <X size={22} />
              </span>
            )}
            <span className="text-[9px] font-semibold tracking-widest uppercase opacity-50 leading-none">
              {isHeaderMenuOpenWhenChangingMobile ? "ĐÓNG" : "MENU"}
            </span>
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-85"
          >
            <div className="h-14 flex items-center">
              <img
                src="/UniCoffeeRoastery.png"
                alt="UniCoffeeRoastery"
                className="h-10 w-auto"
              />
            </div>
          </Link>

          {/* Spacer (desktop) */}
          <div className="hidden lg:flex flex-1" />

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Account */}
            <Link
              to={accountLink}
              className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-muted/70 transition-all duration-200 active:scale-95 group"
            >
              <User
                size={20}
                className="text-foreground/70 group-hover:text-foreground transition-colors duration-200"
              />
              <span className="text-[9px] font-semibold tracking-widest uppercase opacity-50 leading-none hidden sm:block">
                {isAuthenticated ? user.username : "Tài khoản"}
              </span>
            </Link>

            {/* Cart */}
            {isEndCustomer && (
              <Link
                to={PATH_END_CUSTOMER.cart}
                className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl hover:bg-muted/70 transition-all duration-200 active:scale-95 relative group"
              >
                <ShoppingCart
                  size={20}
                  className="text-foreground/70 group-hover:text-foreground transition-colors duration-200"
                />
                <span className="text-[9px] font-semibold tracking-widest uppercase opacity-50 leading-none hidden sm:block">
                  Giỏ hàng
                </span>
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold leading-none"
                    style={{
                      animation: "cartBounce 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                  >
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            )}

            {/* Theme toggle */}
            <button
              onClick={() => setTheme(actualTheme === "dark" ? "light" : "dark")}
              className="relative inline-flex h-8 w-[3.4rem] shrink-0 items-center rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 transition-all duration-300 hover:opacity-90 active:scale-95"
              style={{
                background:
                  actualTheme === "dark"
                    ? "linear-gradient(135deg, #334155, #475569)"
                    : "linear-gradient(135deg, #f59e0b, #fbbf24)",
              }}
              aria-label="Chuyển đổi chế độ giao diện"
            >
              {/* Sun icon */}
              <Sun
                size={12}
                className="absolute left-1.5 transition-all duration-300"
                style={{
                  opacity: actualTheme === "dark" ? 0.4 : 0,
                  color: "#fef3c7",
                  transform: actualTheme === "dark" ? "scale(1)" : "scale(0)",
                }}
              />
              {/* Moon icon */}
              <Moon
                size={12}
                className="absolute right-1.5 transition-all duration-300"
                style={{
                  opacity: actualTheme === "dark" ? 0 : 0.35,
                  color: "#fef3c7",
                  transform: actualTheme === "dark" ? "scale(0)" : "scale(1)",
                }}
              />
              {/* Knob */}
              <span
                className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                style={{
                  transform: actualTheme === "dark" ? "translateX(26px)" : "translateX(2px)",
                }}
              >
                {actualTheme === "dark" ? (
                  <Moon size={13} className="text-slate-600" />
                ) : (
                  <Sun size={13} className="text-amber-500" />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop nav ── */}
      <nav
        className="hidden lg:flex items-center justify-center py-2.5 border-t border-border/50"
        style={{
          background: "hsl(var(--background) / 0.97)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-10 xl:gap-14">
          {NAV_ROUTES.map((route) =>
            route.children ? (
              <DesktopDropdownNavItem
                key={route.key}
                route={route}
                isActive={activeKey === route.key}
                onChildClick={handleNavClick}
              />
            ) : (
              <DesktopNavItem
                key={route.key}
                route={route}
                isActive={activeKey === route.key}
                onClick={() => handleNavClick(route.url)}
              />
            ),
          )}
        </div>
      </nav>

      {/* ── Mobile overlay ── */}
      <MobileOverlay
        isOpen={isHeaderMenuOpenWhenChangingMobile}
        onClose={() =>
          dispatch(handleChangeHeaderMenuOpenWhenChangingMobile(false))
        }
        activeKey={activeKey}
        pathname={location.pathname}
        onNavigate={handleNavClick}
      />

      {/* Cart badge bounce keyframe */}
      <style>{`
        @keyframes cartBounce {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </header>
  );
}