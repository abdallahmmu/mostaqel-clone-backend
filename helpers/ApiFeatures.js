export default class ApiFeatures{
    constructor(queryString, mongooseQuery){
        this.mongooseQuery= mongooseQuery;
        this.queryString = queryString
    }


    filter(){
        let queryStringObj = { ...this.queryString};

        ['page', 'sort', 'fields', 'limit', 'keyword'].forEach( item =>  delete queryStringObj[item])


        let queryStr = JSON.stringify(queryStringObj)
        
        queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, match => `$${match}`);
        
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr))


        return this
    }

    sort(){

        let { sort } = { ...this.queryString};
        if(sort){
            sort = sort.split(',').join(' ');
            this.mongooseQuery =  this.mongooseQuery.sort(sort)
        }else{
            this.mongooseQuery =  this.mongooseQuery.sort('-createAt')
        }

        return this
    }

    select() {
        let { fields } = { ...this.queryString};

        if(fields){

            fields = fields.split(',').join(' ');
            console.log(fields)
            this.mongooseQuery =  this.mongooseQuery.select(fields)
        }else{
            this.mongooseQuery =  this.mongooseQuery.select("-__v")
        }

        return this
    }

    search() {
        let  { keyword } = { ...this.queryString}
       
        if(this.queryString.keyword){
            let query= {}
            query.$or = [
                { title: { $regex: this.queryString.keyword, $options: 'i' }},
                {description: {$regex: this.queryString.keyword, $options: 'i'}}  ];

                console.log(this.queryString.keyword)
            this.mongooseQuery = this.mongooseQuery.find(query)
        }

        return this
    }

    paginate(totalDocuments) {

        let  page  = this.queryString.page || 1;
        let  limit  = this.queryString.limit || 5;
        page = page || 1;
        limit = limit || 5;
        let skip = (page -  1 ) * page;
        let endIndex = page * limit;

        let pagination = {};

        pagination.currentPage = +page;
        pagination.limit = limit;
        pagination.numOfPages = Math.ceil( totalDocuments / limit);

        
        if( endIndex < totalDocuments ){
            pagination.next = +page + 1; 
        }
        

        if( skip > 0){
            pagination.prev = +page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

        this.pagination = pagination
        return this
      
    }
}
