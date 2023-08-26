import { ObjectId } from 'mongodb';

export class ListMoviesPipeline {
  private pipeline: object[] = [];

  public setMatchById(id: string): void {
    const objectIDParam = new ObjectId(id);

    this.pipeline.push({
      $match: {
        _id: objectIDParam,
      },
    });
  }
  public setLookUpReviews(searchText?: string): void {
    const match = {
      $match: {
        $expr: {
          $eq: ['$movie_id', '$$movie_id'],
        },
      },
    };
    if (String(searchText || '').trim().length > 0) {
      match['$match'] = Object.assign(match['$match'], {
        $text: {
          $search: String(searchText || '').trim(),
          $diacriticSensitive: true,
        },
      });
    }

    this.pipeline.push({
      $lookup: {
        from: 'reviews',
        let: {
          movie_id: '$_id',
        },
        pipeline: [
          match,
          {
            $lookup: {
              from: 'platforms',
              localField: 'platform_id',
              foreignField: '_id',
              as: 'platform',
            },
          },
          {
            $unwind: '$platform',
          },
          {
            $group: {
              _id: '$platform.name',
              reviews: {
                $push: {
                  author: '$author',
                  body: '$body',
                  score: '$score',
                },
              },
            },
          },
          {
            $project: {
              review: {
                k: '$_id',
                v: '$reviews',
              },
            },
          },
          {
            $group: {
              _id: null,
              cv: { $push: '$review' },
            },
          },
          {
            $replaceRoot: {
              newRoot: { $arrayToObject: '$cv' },
            },
          },
        ],
        as: 'reviews',
      },
    });
  }

  public setUnwindReviews(): void {
    this.pipeline.push({
      $unwind: {
        path: '$reviews',
        preserveNullAndEmptyArrays: true,
      },
    });
  }
  public setMatchForceReviews(): void {
    this.pipeline.push({
      $match: {
        reviews: { $nin: [null, [], {}] },
      },
    });
  }

  public setPagination(skip: number, limit: number): void {
    this.pipeline.push({
      $skip: Number(skip),
    });
    this.pipeline.push({
      $limit: Number(limit),
    });
  }

  public setVisibleFields(): void {
    this.pipeline.push({
      $project: {
        title: 1,
        director: 1,
        country: 1,
        score: 1,
        image: 1,
        slug: 1,
        reviews: 1,
        platforms: 1,
      },
    });
  }
  public getArray(): object[] {
    return this.pipeline;
  }
}
