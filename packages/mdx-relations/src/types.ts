export type MetadataGenerator<F, T = unknown> = (page: BasePage<F>) => T;

export type RelationGenerator<
  F,
  M extends MetadataGenerators<F>,
  T = unknown,
> = (
  page: PageWithMetadata<F, M>,
  index: number,
  allPages: PageWithMetadata<F, M>[],
) => T;

export type MetadataGenerators<F> = Record<string, MetadataGenerator<F>>;

export type RelationGenerators<
  F,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
> = Record<string, RelationGenerator<F, M>>;

export type Config<
  F,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
> = {
  contentDirectory: string;
  metadataGenerators?: M;
  relationGenerators?: R;
  runGenerators?: boolean;
};

export type File = {
  filePath: string;
  params: {
    slug: string[];
  };
};

export type BasePage<F> = File & {
  content: string;
  frontmatter: F;
  updatedAt?: number;
};

export type InferMetadataTypes<F, M = MetadataGenerators<F>> = {
  [K in keyof M]: M[K] extends MetadataGenerator<F> ? ReturnType<M[K]> : never;
};

export type InferRelationTypes<
  F,
  M extends MetadataGenerators<F>,
  R extends RelationGenerators<F, M>,
> = {
  [K in keyof R]: ReturnType<R[K]>;
};

export type PageWithMetadata<
  F,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
> = BasePage<F> & {
  metadata: InferMetadataTypes<F, M>;
};

export type Page<
  F,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  _R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
> = PageWithMetadata<F, M>;

export type Filter<
  F,
  M extends MetadataGenerators<F> = MetadataGenerators<F>,
  R extends RelationGenerators<F, M> = RelationGenerators<F, M>,
  T extends Page<F, M, R> = Page<F, M, R>,
> = (page: T, index: number, array: T[]) => boolean;
