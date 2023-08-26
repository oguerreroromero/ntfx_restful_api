export interface IBuilderPipeline {
  setMatchById(id?: string): this;
  setLookUpReviews(searchText?: string): this;
  setUnwindReviews(): this;
  setMatchForceReviews(): this;
  setPagination(skip: number, limit: number): this;
  setVisibleFields(): this;
  getArray(): object[];
}
