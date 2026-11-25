import { articles, localize } from "@/data/sansphase";
import { demoBooks } from "@/data/sansphase-library";
import { sansphaseMaterials } from "@/data/sansphase-materials";
import type { ResourcePublicationDay, SitePublishing } from "@/lib/site-publishing-model";

function getDemoActivity(today: string): ResourcePublicationDay[] {
  const dates = new Map<string, ResourcePublicationDay>();
  const catalogues = { resourceCenter: demoBooks, materials: sansphaseMaterials } as const;
  for (const kind of ["resourceCenter", "materials"] as const) {
    for (const { date } of catalogues[kind]) {
      if (date > today) continue;
      const day = dates.get(date) ?? { date, resourceCenter: 0, materials: 0 };
      day[kind]++;
      dates.set(date, day);
    }
  }
  return [...dates.values()].sort((left, right) => left.date.localeCompare(right.date));
}

/** The frontend preview can be built and viewed using only local content. */
export function getSitePublishingPreview(locale: string, today: string): SitePublishing {
  const notes = articles
    .filter(({ date }) => date <= today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ slug, title, summary, tags, date, href }) => ({
      id: slug,
      title,
      summary,
      tags: tags.map((tag) => localize(tag, locale)),
      date,
      href,
    }));
  return { notes, noteTotal: notes.length, activity: getDemoActivity(today) };
}
