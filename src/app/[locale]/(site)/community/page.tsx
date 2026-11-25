import type { Metadata } from "next";
import { connection } from "next/server";
import { getLocale } from "next-intl/server";
import { CommunityBoards } from "@/components/community/community-boards";
import { CommunityEntry } from "@/components/community/community-entry";
import { CommunityFeed } from "@/components/community/community-feed";
import { communityCopy, toCommunityLocale } from "@/components/community/copy";
import { communityEntryCopy } from "@/components/community/entry-copy";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { Tag } from "@/components/ui/tag";
import { demoTopicSummaries } from "@/data/sansphase-community";
import { communityEntryPost } from "@/lib/community-entry";
import { sansphasePageMetadata } from "@/lib/sansphase-page-metadata";
import { siteBackendOrigin } from "@/lib/site-backend";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const language = toCommunityLocale(locale);
  const copy = communityCopy[language];
  return sansphasePageMetadata(locale, "/community", copy.name, siteBackendOrigin() ? communityEntryCopy[language].intro : copy.intro);
}

type Props = { searchParams: Promise<{ post?: string | string[] }> };

export default async function CommunityPage({ searchParams }: Props) {
  await connection();
  const locale = toCommunityLocale(await getLocale());
  const copy = communityCopy[locale];

  if (siteBackendOrigin()) {
    const { post } = await searchParams;
    return (
      <PageHeader eyebrow={copy.name} title={copy.title} accent={copy.accent} body={communityEntryCopy[locale].intro}>
        <CommunityEntry locale={locale} post={communityEntryPost(post)} />
      </PageHeader>
    );
  }

  return (
    <>
      <PageHeader eyebrow={copy.name} title={copy.title} accent={copy.accent} body={copy.intro}>
        <div className="flex flex-wrap items-center gap-2.5">
          <ButtonLink href="/community/new" arrow>{copy.newPost}</ButtonLink>
          <ButtonLink href="/community/convention" variant="secondary">{copy.convention}</ButtonLink>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Tag tone="accent">{copy.preview}</Tag>
          <p className="text-xs text-muted">{copy.previewDescription}</p>
        </div>
      </PageHeader>
      <div className="container-x grid items-start gap-9 pb-16 pt-6 lg:grid-cols-[minmax(0,1fr)_19rem] xl:gap-12">
        <CommunityFeed locale={locale} topics={demoTopicSummaries} />
        <CommunityBoards locale={locale} />
      </div>
    </>
  );
}
