export default class ApiFeatures {
  constructor(queryString, mongooseQuery) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  filter() {
    let queryStringObj = { ...this.queryString };

    [
      "page",
      "sort",
      "fields",
      "limit",
      "keyword",
      "skillsIds",
      "categoryIds",
      "lang",
    ].forEach((item) => delete queryStringObj[item]);

    let newQueryObj;
    if (
      Object.keys(queryStringObj).length > 1 &&
      Object.keys(queryStringObj).includes("range_lt")
    ) {
      newQueryObj = {
        ...queryStringObj,
        range: {
          $lt: queryStringObj.range_lt,
          $gt: queryStringObj.range_gt,
        },
      };
    } else {
      newQueryObj = queryStringObj;
    }
    ["range_lt", "range_gt"].forEach((item) => delete newQueryObj[item]);

    this.mongooseQuery = this.mongooseQuery.find(newQueryObj);

    return this;
  }

  sort() {
    let { sort } = { ...this.queryString };
    if (sort) {
      // sort = sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sort);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createAt");
    }

    return this;
  }

  select() {
    let { fields } = { ...this.queryString };

    if (fields) {
      fields = fields.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }

    return this;
  }

  search() {
    if (this.queryString.keyword) {
      let query = {};
      query.$or = [
        { title: { $regex: this.queryString.keyword, $options: "i" } },
        { description: { $regex: this.queryString.keyword, $options: "i" } },
      ];

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }

  paginate(totalDocuments) {
    let page = this.queryString.page || 1;
    let limit = this.queryString.limit || 5;

    let skip = (page - 1) * limit;
    let endIndex = page * limit;

    let pagination = {};

    pagination.currentPage = +page;
    pagination.limit = limit;
    pagination.numOfPages = Math.ceil(totalDocuments / limit);

    if (endIndex < totalDocuments) {
      pagination.next = +page + 1;
    }

    if (skip > 0) {
      pagination.prev = +page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.pagination = pagination;
    return this;
  }

  Skills() {
    let { skillsIds } = { ...this.queryString };

    if (skillsIds) {
      // skillsIds = skillsIds.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.find({
        skillsIds: { $in: skillsIds },
      });
    }
    return this;
  }

  Categories() {
    let { categoryIds } = { ...this.queryString };
    if (categoryIds) {
      this.mongooseQuery = this.mongooseQuery.find({
        categoryId: { $in: categoryIds },
      });
    }
    return this;
  }
}
