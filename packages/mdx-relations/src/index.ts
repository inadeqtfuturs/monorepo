import fs from 'node:fs/promises';
import path from 'node:path';
import glob from 'fast-glob';
import matter from 'gray-matter';

import type {
  BasePage,
  Config,
  File,
  Filter,
  InferMetadataTypes,
  MetadataGenerators,
  Page,
  PageWithMetadata,
  RelationGenerators,
} from './types';

function createUtils<
  F,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
>(config: Config<F, M, R>) {
  const getFiles = async (
    config: Config<F, M, R>,
    pathToFiles?: string,
  ): Promise<File[]> => {
    const pathToContent = path.join(
      process.cwd(),
      pathToFiles || config.contentDirectory,
    );
    const pattern = `${pathToContent}/**/*.(md|mdx)`;

    try {
      const files = await glob(pattern, {
        ignore: ['**/node_modules/**'],
      });

      return files.map((filePath) => {
        const relativePath = path.relative(pathToContent, filePath);
        const slug = relativePath
          .replace(new RegExp(`${path.extname(filePath)}$`), '')
          .split('/');
        return { filePath, params: { slug } };
      });
    } catch (error) {
      console.error('Error reading files:', error);
      return [];
    }
  };

  const generateMetadata = (
    page: BasePage<F>,
    metadataGenerators: M,
  ): InferMetadataTypes<F, M> => {
    return Object.entries(metadataGenerators).reduce(
      (acc, [key, generator]) => {
        // biome-ignore lint/suspicious: actual any
        (acc as any)[key] = generator(page);
        return acc;
      },
      {} as InferMetadataTypes<F, M>,
    );
  };

  const generatePage = async (
    file: File,
    metadataGenerators?: M,
  ): Promise<PageWithMetadata<F, M>> => {
    try {
      const mdxSource = await fs.readFile(file.filePath, 'utf-8');
      const { content, data } = matter(mdxSource);

      const frontmatter = data as F;

      const generatedMetadata = metadataGenerators
        ? generateMetadata(
            { ...file, content, frontmatter },
            metadataGenerators,
          )
        : ({} as InferMetadataTypes<F, M>);

      return {
        ...file,
        content,
        frontmatter,
        metadata: generatedMetadata,
      };
    } catch (error) {
      console.error(`Error generating page for ${file.filePath}:`, error);
      throw error;
    }
  };

  const getPaths = async (config: Config<F, M, R>, contentPath?: string) => {
    const pathToFiles = contentPath || config.contentDirectory;
    const files = await getFiles(config, pathToFiles);

    const paths = files.map(({ params }) => ({ params }));
    return paths;
  };

  const generateRelations = (
    pages: PageWithMetadata<F, M>[],
    relationGenerators: R,
  ): Page<F, M, R>[] => {
    return Object.entries(relationGenerators).reduce(
      (acc, [key, generator]) => {
        const relations = pages.map((page, index) =>
          generator(page, index, pages),
        );

        return acc.map((page, index) => ({
          ...page,
          metadata: {
            ...page.metadata,
            [key]: relations[index],
          },
        }));
      },
      pages as Page<F, M, R>[],
    );
  };

  const filterPages = (
    pages: Page<F, M, R>[],
    filter: Filter<F, M, R>,
  ): Page<F, M, R>[] => pages.filter(filter);

  const getPages = async <C extends Config<F, M, R>>(
    config: C,
    filter?: Filter<F, M, R>,
  ): Promise<Page<F, M, R>[]> => {
    try {
      const files = await getFiles(config);

      const pages = await Promise.all(
        files.map((file) => generatePage(file, config.metadataGenerators)),
      );

      const pagesWithRelations = config.relationGenerators
        ? generateRelations(pages, config.relationGenerators)
        : (pages as Page<F, M, R>[]);

      return filter
        ? filterPages(pagesWithRelations, filter)
        : pagesWithRelations;
    } catch (error) {
      console.error('Error getting pages:', error);
      throw error;
    }
  };

  const getPage = async (
    config: Config<F, M, R>,
    slug: string,
  ): Promise<BasePage<F> | undefined> => {
    try {
      const files = await getFiles(config);
      const pages = await Promise.all(files.map((file) => generatePage(file)));

      return pages.find(
        ({ params: { slug: pageSlug } }) => pageSlug.join('/') === slug,
      );
    } catch (error) {
      console.error(`Error getting ${slug}:`, error);
      throw error;
    }
  };

  return {
    getPaths: async (contentPath?: string) => getPaths(config, contentPath),
    getPage: ({ slug }: { slug: string }) => getPage(config, slug),
    getPages: ({ filter }: { filter?: Filter<F, M, R> } = {}) =>
      getPages(config, filter),
  };
}

export default createUtils;
