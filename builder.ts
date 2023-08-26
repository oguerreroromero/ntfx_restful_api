/*interface IBuilderPipeline {
	setMatchById(id?:string):this;
	setLookUpReviews(searchText?:string):this;
	setUnwindReviews():this;
	setMatchForceReviews():this;
	setPagination(skip:number,limit:number):this;
	setVisibleFields():this;
	getArray():object[];
}

class ListMoviesPipeline{
	private pipeline:object[]=[];

	public setMatchById(id):void{
		this.pipeline.push({
			"$match":{
				_id : id
			}
		});
	}
	public setLookUpReviews(searchText?:string):void{

		let match = {
                    $match:{
                        $expr:{
                          $eq:["$movie_id","$$movie_id"]  
                        }                        
                    }
                };
        if(
        	String(searchText||"").trim().length > 0
        ){
        	match["$match"] = Object.assign( 
        				match["$match"],
        				{ 
        					$text:{
                            	$search:String(searchText||"").trim(),
                            	$diacriticSensitive: true,
                        	}
                        }
                    );
        }

		this.pipeline.push({
								$lookup:{
					            from:"reviews",
					            let : {
					                movie_id : "$_id"
					            },
					            pipeline:[
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
					            as:"reviews"
					        }
		});
	}

	public setUnwindReviews():void{
		this.pipeline.push({
					        $unwind:{
					            path:"$reviews",
					            preserveNullAndEmptyArrays:true
					        }
					    });
	}
	public setMatchForceReviews():void{
		this.pipeline.push(
			{
		      $match:{
		        reviews:{$nin:[null,[],{}]}
		      }  
		    },
		);
	}

	public setPagination(skip:number,limit:number):void{
		this.pipeline.push({
			$skip:Number(skip)
		});
		this.pipeline.push({
			$limit:Number(limit)
		});
	}

	public setVisibleFields():void{
		this.pipeline.push({
	        $project:{
	            title:1,
	            director:1,
	            country:1,
	            score:1,
	            image:1,
	            slug:1,
	            reviews:1,
	            platforms:1
	        }
    	});
	}
	public getArray():object[]{
		return this.pipeline;
	}

}

class PipelineBuilder implements IBuilderPipeline{
	private pipeline: ListMoviesPipeline;

	constructor(){
		this.pipeline = new ListMoviesPipeline();
	}

	public setMatchById(id:string):this{
		this.pipeline.setMatchById(id)
		return this;
	}

	public setLookUpReviews(searchText?:string):this{
		this.pipeline.setLookUpReviews(searchText);
		return this;
	}

	public setUnwindReviews():this{
		this.pipeline.setUnwindReviews();
		return this;
	}

	public setMatchForceReviews():this{
		this.pipeline.setMatchForceReviews();
		return this;
	}

	public setPagination(skip:number,limit:number):this{
		this.pipeline.setPagination(skip,limit);
		return this;
	}

	public setVisibleFields():this{

		this.pipeline.setVisibleFields();

		return this;
	}

	public getArray():object[]{
		return this.pipeline.getArray();
	}
	
	public build():object[]{
		return this.getArray();
	}
}

const pipelineById =  new PipelineBuilder()
										.setMatchById("")
										.setLookUpReviews()
										.setUnwindReviews()
										.setPagination(0,1)
										.setVisibleFields()
										.build();

console.log(pipelineById);

const pipelineAll =  new PipelineBuilder()
										.setLookUpReviews("hola")
										.setUnwindReviews()
										.setMatchForceReviews()
										.setPagination(0,100)
										.setVisibleFields()
										.build();

console.log(pipelineAll);*/