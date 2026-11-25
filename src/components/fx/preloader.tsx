"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { REDUCED_MOTION_QUERY, useHydrated } from "./hooks";
import { createIntroScript, getIntroSkipped, markIntroDone, useIntroSkipped } from "./intro-store";
import { lockScroll, unlockScroll } from "./lenis";

/**
 * First-visit-per-session intro: counter 000→100, the brand mark, then a
 * two-panel curtain. The whole timeline is CSS (it starts at first paint and finishes even
 * without JS); React only syncs `useIntroDone()` to the curtain and unmounts the overlay.
 */
export function Preloader({ homePath }: { homePath: string }) {
  const t = useTranslations("FX.common.preloader");
  const ref = useRef<HTMLDivElement>(null);
  const skipped = useIntroSkipped();
  const hydrated = useHydrated();
  // Only an overlay that came with the server HTML may play; a client-only remount would replay it.
  const [fromServer] = useState(!hydrated);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const overlay = ref.current;
    if (getIntroSkipped() || !overlay) return;
    let cancelled = false;
    let openTimer = 0;
    const open = () => {
      markIntroDone();
      unlockScroll("intro");
    };
    lockScroll("intro");

    const animations = overlay.getAnimations({ subtree: true });
    const curtain = animations.find((animation) => (animation as CSSAnimation).animationName === "fx-pre-top");
    const elapsed = Number(curtain?.currentTime ?? 0);
    const wait = curtain ? Number(curtain.effect?.getTiming().delay ?? 0) - elapsed : 0;
    if (wait > 0) openTimer = window.setTimeout(open, wait);
    else open();

    const finish = () => {
      if (!cancelled) setGone(true);
    };
    Promise.all(animations.map((animation) => animation.finished)).then(finish, finish);
    return () => {
      cancelled = true;
      window.clearTimeout(openTimer);
      unlockScroll("intro");
    };
  }, [skipped]);

  if (!fromServer || skipped || gone) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: createIntroScript(homePath, REDUCED_MOTION_QUERY) }} />
      <div ref={ref} className="fx-preloader" aria-hidden="true">
        <div className="fx-pre-panel fx-pre-top" />
        <div className="fx-pre-panel fx-pre-bottom" />
        <div className="fx-pre-seam" />
        <div className="fx-pre-stage">
          <span className="fx-pre-corner" data-corner="tl" />
          <span className="fx-pre-corner" data-corner="tr" />
          <span className="fx-pre-corner" data-corner="bl" />
          <span className="fx-pre-corner" data-corner="br" />
          <p className="fx-pre-label">SANSPHASE / {t("label")}</p>
          <div className="fx-pre-mark grid place-items-center whitespace-nowrap font-display text-6xl leading-none font-semibold tracking-tight sm:text-7xl">
            <span className="bg-linear-to-r from-accent via-amber to-accent-strong bg-clip-text text-transparent" lang="zh-CN">
              無相
            </span>
          </div>
          <div className="fx-pre-meta">
            <span className="fx-pre-bar" />
            <span className="fx-pre-count" />
            <span className="fx-pre-status">
              <span>{t("loading")}</span>
              <span>{t("ready")}</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
