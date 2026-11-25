import { ArrowUpRight, Monitor } from "lucide-react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { getLocale } from "next-intl/server";
import { ConnectedCatalog } from "@/components/catalog/connected-catalog";
import { SpotlightCard } from "@/components/fx/spotlight";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { localize } from "@/data/sansphase";
import { softwareSamples } from "@/data/sansphase-software";
import { Link } from "@/i18n/navigation";
import { sansphasePageMetadata } from "@/lib/sansphase-page-metadata";
import { siteBackendOrigin } from "@/lib/site-backend";

const heading = {
  label: { zh: "软件推荐", en: "Software" },
  title: { zh: "工具与", en: "Tools from" },
  accent: { zh: "使用体验。", en: "the workbench." },
  body: { zh: "了解工具的适用场景、支持的平台和上手方法。", en: "Find out where a tool fits, which platforms it supports and how to get started." },
  demo: { zh: "以下为演示推荐。", en: "These are demo recommendations." },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return sansphasePageMetadata(locale, "/software", localize(heading.label, locale), localize(heading.body, locale));
}

export default async function SoftwarePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await connection();
  const locale = await getLocale();
  const text = (value: Parameters<typeof localize>[0]) => localize(value, locale);
  const origin = siteBackendOrigin();
  const intro = origin ? text(heading.body) : text(heading.body) + (locale === "en" ? " " : "") + text(heading.demo);

  return (
    <>
      <PageHeader eyebrow={text(heading.label)} title={text(heading.title)} accent={text(heading.accent)} body={intro} />
      {origin ? <ConnectedCatalog origin={origin} kind="software" locale={locale} search={await searchParams} /> : (
        <ul className="container-x grid gap-5 pb-12 pt-6 sm:grid-cols-2 sm:pb-16 xl:grid-cols-3">
        {softwareSamples.map((item) => (
          <li key={item.id}>
            <SpotlightCard className="h-full overflow-hidden rounded-2xl border border-line bg-bg-elevated">
              <Link href={`/software/${item.id}`} className="group flex h-full flex-col gap-4 p-6 transition-colors hover:text-accent focus-visible:text-accent">
                <div className="flex items-center justify-between gap-3">
                  <Tag tone="accent">{text(item.category)}</Tag>
                  <ArrowUpRight className="size-4 shrink-0 text-accent" aria-hidden />
                </div>
                <h2 className="font-display text-xl font-semibold">{text(item.title)}</h2>
                <p className="text-sm leading-7 text-muted">{text(item.summary)}</p>
                <p className="mt-auto flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
                  <Monitor className="size-4 shrink-0 text-accent" aria-hidden /> {text(item.platforms)}
                </p>
              </Link>
            </SpotlightCard>
          </li>
        ))}
        </ul>
      )}
    </>
  );
}
