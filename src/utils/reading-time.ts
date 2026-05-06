// 估算阅读时长（中文为主）
// 中文阅读速度：约 300 字 / 分钟（保守估值，便于读者真正读完）
// 英文按 220 词 / 分钟，混合内容自动加权

const CHARS_PER_MIN_CN = 300;
const WORDS_PER_MIN_EN = 220;

/**
 * 移除 mdx 的 frontmatter / 代码块 / HTML 标签 / mdx 组件标签
 * 保留可读正文用于字数统计
 */
function stripMarkdown(raw: string): string {
  let s = raw;
  // frontmatter
  s = s.replace(/^---[\s\S]*?---/m, '');
  // 代码块 ``` ... ```
  s = s.replace(/```[\s\S]*?```/g, '');
  // 行内代码
  s = s.replace(/`[^`]*`/g, '');
  // 图片 ![alt](url)
  s = s.replace(/!\[[^\]]*\]\([^)]*\)/g, '');
  // 链接 [text](url) -> text
  s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  // HTML / JSX 标签（含 mdx 组件 <Foo .../>）
  s = s.replace(/<[^>]+>/g, '');
  // markdown 语法标记
  s = s.replace(/[#>*_~`|\-]/g, ' ');
  return s;
}

export function estimateReadingMinutes(raw: string): number {
  if (!raw) return 1;
  const text = stripMarkdown(raw);

  // 中文字符数
  const cnChars = (text.match(/[一-鿿]/g) || []).length;
  // 英文单词数
  const enWords = (text.match(/[A-Za-z]+/g) || []).length;

  const minutes = cnChars / CHARS_PER_MIN_CN + enWords / WORDS_PER_MIN_EN;
  return Math.max(1, Math.round(minutes));
}

export function formatReadingTime(minutes: number): string {
  return `约 ${minutes} 分钟阅读`;
}
