import createUtils from '@if/mdx-relations';
import markdownLinkExtractor from 'markdown-link-extractor';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

type FrontMatter = {
  title: string;
  date: string;
  tags: string[];
  draft: boolean;
  excerpt: string;
};

// blog
const { getPages: getBlogPages } = createUtils<FrontMatter>({
  contentDirectory: '../../content/garden/',
  metadataGenerators: {
    date: ({ frontmatter: { date } }) => {
      return dateFormatter.format(new Date(date));
    },
    mentions: ({ content }) => markdownLinkExtractor(content) as string[],
  },
  relationGenerators: {
    mentionedIn: (page, _i, pages) => {
      const pageMentionedIn = pages.filter(({ metadata: { mentions } }) => {
        // mentions below is inferred as `undefined`
        return mentions.includes(`/garden/${page.params.slug}`);
      });
      return pageMentionedIn;
    },
  },
});

const { getPages, getPage } = createUtils({
  contentDirectory: '../../content/pages',
});
const { getPages: getWork } = createUtils({
  contentDirectory: '../../content/work',
});

const { getPages: getChangelogEntries } = createUtils<{ title: string }>({
  contentDirectory: '../../content/changelog',
});

export type ChangelogEntryType = Awaited<
  ReturnType<typeof getChangelogEntries>
>[number];
export type Page = Awaited<ReturnType<typeof getBlogPages>>[number];

export { getBlogPages, getChangelogEntries, getPage, getPages, getWork };
