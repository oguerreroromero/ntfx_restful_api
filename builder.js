var ListMoviesPipeline = /** @class */ (function () {
    function ListMoviesPipeline() {
        this.pipeline = [];
    }
    ListMoviesPipeline.prototype.setMatchById = function (id) {
        this.pipeline.push({
            "$match": {
                _id: id
            }
        });
    };
    ListMoviesPipeline.prototype.setLookUpReviews = function (searchText) {
        var match = {
            $match: {
                $expr: {
                    $eq: ["$movie_id", "$$movie_id"]
                }
            }
        };
        if (String(searchText || "").trim().length > 0) {
            match["$match"] = Object.assign(match["$match"], {
                $text: {
                    $search: String(searchText || "").trim(),
                    $diacriticSensitive: true,
                }
            });
        }
        this.pipeline.push({
            $lookup: {
                from: "reviews",
                let: {
                    movie_id: "$_id"
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
                    }
                ],
                as: "reviews"
            }
        });
    };
    ListMoviesPipeline.prototype.setUnwindReviews = function () {
        this.pipeline.push({
            $unwind: {
                path: "$reviews",
                preserveNullAndEmptyArrays: true
            }
        });
    };
    ListMoviesPipeline.prototype.setMatchForceReviews = function () {
        this.pipeline.push({
            $match: {
                reviews: { $nin: [null, [], {}] }
            }
        });
    };
    ListMoviesPipeline.prototype.setPagination = function (skip, limit) {
        this.pipeline.push({
            $skip: Number(skip)
        });
        this.pipeline.push({
            $limit: Number(limit)
        });
    };
    ListMoviesPipeline.prototype.setVisibleFields = function () {
        this.pipeline.push({
            $project: {
                title: 1,
                director: 1,
                country: 1,
                score: 1,
                image: 1,
                slug: 1,
                reviews: 1,
                platforms: 1
            }
        });
    };
    ListMoviesPipeline.prototype.getArray = function () {
        return this.pipeline;
    };
    return ListMoviesPipeline;
}());
var PipelineBuilder = /** @class */ (function () {
    function PipelineBuilder() {
        this.pipeline = new ListMoviesPipeline();
    }
    PipelineBuilder.prototype.setMatchById = function (id) {
        this.pipeline.setMatchById(id);
        return this;
    };
    PipelineBuilder.prototype.setLookUpReviews = function (searchText) {
        this.pipeline.setLookUpReviews(searchText);
        return this;
    };
    PipelineBuilder.prototype.setUnwindReviews = function () {
        this.pipeline.setUnwindReviews();
        return this;
    };
    PipelineBuilder.prototype.setMatchForceReviews = function () {
        this.pipeline.setMatchForceReviews();
        return this;
    };
    PipelineBuilder.prototype.setPagination = function (skip, limit) {
        this.pipeline.setPagination(skip, limit);
        return this;
    };
    PipelineBuilder.prototype.setVisibleFields = function () {
        this.pipeline.setVisibleFields();
        return this;
    };
    PipelineBuilder.prototype.getArray = function () {
        return this.pipeline.getArray();
    };
    PipelineBuilder.prototype.build = function () {
        return this.getArray();
    };
    return PipelineBuilder;
}());
var pipelineById = new PipelineBuilder()
    .setMatchById("")
    .setLookUpReviews()
    .setUnwindReviews()
    .setPagination(0, 1)
    .setVisibleFields()
    .build();
console.log(pipelineById);
var pipelineAll = new PipelineBuilder()
    .setLookUpReviews("hola")
    .setUnwindReviews()
    .setMatchForceReviews()
    .setPagination(0, 100)
    .setVisibleFields()
    .build();
console.log(pipelineAll);
