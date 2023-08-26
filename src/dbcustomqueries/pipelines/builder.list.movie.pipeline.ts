import { IBuilderPipeline } from './interface.find.pipeline';
import { ListMoviesPipeline } from './list.movie.pipeline';

export class PipelineBuilder implements IBuilderPipeline {
  private pipeline: ListMoviesPipeline;

  constructor() {
    this.pipeline = new ListMoviesPipeline();
  }

  public setMatchById(id: string): this {
    this.pipeline.setMatchById(id);
    return this;
  }

  public setLookUpReviews(searchText?: string): this {
    this.pipeline.setLookUpReviews(searchText);
    return this;
  }

  public setUnwindReviews(): this {
    this.pipeline.setUnwindReviews();
    return this;
  }

  public setMatchForceReviews(): this {
    this.pipeline.setMatchForceReviews();
    return this;
  }

  public setPagination(skip: number, limit: number): this {
    this.pipeline.setPagination(skip, limit);
    return this;
  }

  public setVisibleFields(): this {
    this.pipeline.setVisibleFields();

    return this;
  }

  public getArray(): object[] {
    return this.pipeline.getArray();
  }

  public build(): object[] {
    return this.getArray();
  }
}
