import type { CollectionEntry } from 'astro:content';

type Post = CollectionEntry<'blog'>;

export interface RelatedPost {
  post: Post;
  score: number;
  shared: {
    series: string[];
    tags: string[];
    sameGame: boolean;
  };
}

/**
 * 评分规则：
 *   每个共享 series  +3
 *   每个共享 tag     +1
 *   game 相同        +0.5
 * 排除自身，分数为 0 的不返回
 */
export function pickRelated(current: Post, all: Post[], limit = 3): RelatedPost[] {
  const curSeries = new Set((current.data.series ?? []).map(String));
  const curTags = new Set((current.data.tags ?? []).map(String));
  const curGame = (current.data.game ?? '').trim();

  const scored: RelatedPost[] = [];

  for (const post of all) {
    if (post.id === current.id) continue;

    const sharedSeries = (post.data.series ?? []).filter((s) => curSeries.has(String(s)));
    const sharedTags = (post.data.tags ?? []).filter((t) => curTags.has(String(t)));
    const sameGame = !!curGame && (post.data.game ?? '').trim() === curGame;

    const score =
      sharedSeries.length * 3 +
      sharedTags.length * 1 +
      (sameGame ? 0.5 : 0);

    if (score <= 0) continue;

    scored.push({
      post,
      score,
      shared: { series: sharedSeries, tags: sharedTags, sameGame },
    });
  }

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    // 同分按发布日期新优先
    return b.post.data.pubDate.valueOf() - a.post.data.pubDate.valueOf();
  });

  return scored.slice(0, limit);
}
