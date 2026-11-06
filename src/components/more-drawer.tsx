import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, ChevronRight, Globe, Menu, Settings, ShieldCheck, Users, X } from "lucide-react";
import type { ComponentType } from "react";
import { BookmarkIcon, DownloadIcon, DuaIcon, HadithIcon, LecturesIcon, QiblaIcon, RecitationIcon, TasbihIcon } from "@/components/icons/islamic";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { MsgKey } from "@/lib/i18n";
import { LANGUAGES, type Lang } from "@/lib/quran";
import { useLang } from "@/lib/lang";

type To = "/" | "/quran" | "/azkar" | "/ramadan" | "/hadith" | "/lectures" | "/community" | "/tasbih" | "/duas" | "/qibla" | "/reciters" | "/downloads" | "/bookmarks" | "/statistics" | "/settings" | "/privacy";
type Item = { to: To; label: MsgKey | string; icon: ComponentType<{ size?: number; className?: string }> };

// Text-only menu, grouped by purpose. Everything from the old More page lives here.
const GROUPS: { title: MsgKey | string; items: Item[] }[] = [
  { title: "groupLearn", items: [
    { to: "/hadith", label: "navHadith", icon: HadithIcon },
    { to: "/lectures", label: "navLectures", icon: LecturesIcon },
    { to: "/community", label: "navCommunity", icon: Users },
  ] },
  { title: "groupWorship", items: [
    { to: "/tasbih", label: "tasbihTitle", icon: TasbihIcon },
    { to: "/duas", label: "navDuas", icon: DuaIcon },
    { to: "/qibla", label: "navQibla", icon: QiblaIcon },
  ] },
  { title: "Audio", items: [
    { to: "/reciters", label: "Reciters", icon: RecitationIcon },
    { to: "/downloads", label: "Downloads", icon: DownloadIcon },
  ] },
  { title: "groupYou", items: [
    { to: "/bookmarks", label: "navBookmarks", icon: BookmarkIcon },
    { to: "/statistics", label: "navStats", icon: BarChart3 },
    { to: "/settings", label: "navSettings", icon: Settings },
    { to: "/privacy", label: "Privacy Policy", icon: ShieldCheck },
  ] },
];

export function MoreDrawer() {
  const { t, lang, setLang } = useLang();
  const tr = (k: string) => { try { const v = t(k as MsgKey); return v && v !== k ? v : k; } catch { return k; } };
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setOpen(false); }, [path]);

  // Android hardware back button closes the drawer instead of leaving the page.
  useEffect(() => {
    if (!open) return;
    let remove: (() => void) | undefined;
    let cancelled = false;
    void import("@capacitor/core").then(({ Capacitor }) => {
      if (!Capacitor.isNativePlatform()) return;
      return import("@capacitor/app").then(({ App }) =>
        App.addListener("backButton", () => setOpen(false)).then((h) => {
          if (cancelled) void h.remove(); else remove = () => void h.remove();
        }),
      );
    }).catch(() => {});
    return () => { cancelled = true; remove?.(); };
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={tr("navMore")} className="rounded-full text-foreground hover:bg-secondary">
          <Menu size={22} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" hideClose className="drawer-panel flex w-[86vw] max-w-[22rem] flex-col gap-0 border-r-0 p-0">
        <header className="drawer-header">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary ring-1 ring-gold/40"><img src="/logo.png" alt="" className="h-6 w-6" /></span>
          <div className="min-w-0 flex-1">
            <SheetTitle className="truncate font-display text-[1.6rem] leading-none text-primary">{tr("appName")}</SheetTitle>
            <SheetDescription className="mt-1 truncate text-xs text-muted-foreground">{tr("moreTitle")}</SheetDescription>
          </div>
          <SheetClose className="drawer-close" aria-label="Close menu"><X size={20} /></SheetClose>
        </header>
        <nav aria-label={tr("navMore")} className="popup-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-3 pt-1">
          {GROUPS.map((g) => (
            <section key={g.title} className="pt-3 first:pt-1">
              <h2 className="drawer-section-title">{tr(g.title)}</h2>
              <ul className="flex flex-col gap-0.5">
                {g.items.map(({ to, label, icon: Icon }) => {
                  const on = path === to || path.startsWith(to + "/");
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        onClick={() => setOpen(false)}
                        aria-current={on ? "page" : undefined}
                        className={`drawer-link ${on ? "drawer-link-active" : ""}`}
                      >
                        <span className="drawer-icon"><Icon size={20} /></span>
                        <span className="min-w-0 flex-1 break-words leading-snug">{tr(label)}</span>
                        {on && <ChevronRight size={16} className="shrink-0 opacity-60" aria-hidden />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
          <section className="pt-3">
            <h2 className="drawer-section-title">{tr("language")}</h2>
            <label htmlFor="drawer-lang" className="drawer-lang">
              <span className="drawer-icon"><Globe size={20} /></span>
              <select
                id="drawer-lang"
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="min-h-12 min-w-0 flex-1 cursor-pointer appearance-none bg-transparent pr-2 text-[0.95rem] font-medium text-foreground focus:outline-none"
              >
                {LANGUAGES.map((l) => <option key={l.id} value={l.id}>{l.label}</option>)}
              </select>
              <ChevronRight size={16} className="shrink-0 rotate-90 text-muted-foreground" aria-hidden />
            </label>
          </section>
          <div className="h-[var(--safe-bottom,0px)]" aria-hidden />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
