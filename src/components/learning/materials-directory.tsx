"use client";

import { ArrowUpRight, Download, FileText, LayoutGrid, Link2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { SpotlightCard, SpotlightGroup } from "@/components/fx/spotlight";
import { Tag } from "@/components/ui/tag";
import { localize } from "@/data/sansphase";
import { materialDownloadHref, sansphaseMaterials } from "@/data/sansphase-materials";
import { Link } from "@/i18n/navigation";
import { cn, formatDate } from "@/lib/utils";

type MaterialId = (typeof sansphaseMaterials)[number]["id"];

const icons = { "learning-journal": FileText, "project-checklist": LayoutGrid, "source-index": Link2 };

export function MaterialsDirectory() {
  const t = useTranslations("Learning");
  const locale = useLocale();
  const [category, setCategory] = useState<MaterialId | "all">("all");
  const options = ["all", ...sansphaseMaterials.map(({ id }) => id)] as const;
  const entries = sansphaseMaterials.filter(({ id }) => category === "all" || category === id);

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div role="group" aria-label={t("filterLabel")} className="flex flex-wrap gap-2">
          {options.map((id) => (
            <button
              key={id}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm transition-colors",
                id === category ? "border-accent/40 bg-accent-soft text-accent" : "border-line text-muted hover:border-line-strong hover:text-fg",
              )}
              type="button"
              aria-pressed={category === id}
              onClick={() => setCategory(id)}
            >
              {t(`filter.${id}`)}
            </button>
          ))}
        </div>
        <p role="status" className="font-mono text-xs text-muted">{t("count", { count: entries.length })}</p>
      </div>

      <SpotlightGroup as="ul" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((material) => {
          const Icon = icons[material.id];
          const title = localize(material.title, locale);

          return (
            <li key={material.id} className="min-w-0">
              <SpotlightCard as="article" className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-bg-elevated p-6 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl border border-accent/25 bg-accent-soft text-accent">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <Tag>Markdown</Tag>
                </div>
                <time className="mt-5 font-mono text-xs text-muted" dateTime={material.date}>{formatDate(material.date, locale)}</time>
                <h2 className="mt-2 font-display text-xl font-semibold tracking-tight">
                  <Link className="transition-colors hover:text-accent" href={material.detailHref}>{title}</Link>
                </h2>
                <p className="mb-6 mt-3 flex-1 text-sm leading-7 text-muted">{localize(material.summary, locale)}</p>
                <div className="flex flex-wrap items-center justify-between gap-x-3 border-t border-line pt-2 text-sm font-medium">
                  <Link href={material.detailHref} aria-label={t("previewNamed", { title })} className="inline-flex min-h-11 items-center gap-2 transition-colors hover:text-accent">
                    {t("preview")}
                    <ArrowUpRight aria-hidden className="size-4 text-accent" />
                  </Link>
                  <a
                    href={materialDownloadHref(material.id, locale)}
                    download
                    aria-label={t("downloadNamed", { title })}
                    className="group/download inline-flex min-h-11 items-center gap-2 text-muted transition-colors hover:text-accent"
                  >
                    {t("download")}
                    <Download aria-hidden className="size-4 shrink-0 text-accent transition-transform motion-safe:group-hover/download:translate-y-0.5" />
                  </a>
                </div>
              </SpotlightCard>
            </li>
          );
        })}
      </SpotlightGroup>
    </>
  );
}
