import { getBlogPages } from '@content';
import { evaluate } from '@mdx-js/mdx';
import React from 'react';
import * as runtime from 'react/jsx-runtime';
import rehypePrettyCode from 'rehype-pretty-code';
import remarkGfm from 'remark-gfm';
import defaultMetadata from '@/lib/metadata';
import PostHeader from './components/PostHeader';

export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [pageData] = await getBlogPages({
    filter: ({ params: { slug: pageSlug } }) => pageSlug[0] === slug,
  });

  if (!pageData) {
    return defaultMetadata();
  }

  const {
    frontmatter: { title, excerpt },
  } = pageData;

  return defaultMetadata({
    title,
    description: excerpt,
  });
}

async function GardenPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [pageData] = await getBlogPages({
    filter: ({ params: { slug: pageSlug } }) => pageSlug[0] === slug,
  });

  if (!pageData) {
    return null;
  }

  const { content, frontmatter, metadata } = pageData;

  const { default: Content } = await evaluate(content, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypePrettyCode, { theme: 'nord' }]],
  });

  return (
    <main>
      <section className='mdx'>
        <PostHeader frontmatter={frontmatter} metadata={metadata} />
        <Content />
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const pages = await getBlogPages();

  return pages.reduce(
    (a, { params: { slug }, frontmatter: { draft } }) => {
      if (!draft) {
        a.push({ slug: slug[0] });
      }
      return a;
    },
    [] as { slug?: string }[],
  );
}

export default GardenPage;
