import mongoose from 'mongoose';

export class ApiFeatures {


  // mongooseQuery: mongoose model
  // query: req.query
  // populatePath: other referenced model


  constructor(mongooseQuery, query, firstPopulatePath, secondPopulatePath, thirdPopulatePath) {
    this.mongooseQuery = mongooseQuery;
    this.query = query;
    this.populatePaths = [firstPopulatePath, secondPopulatePath, thirdPopulatePath]
      .filter(path => typeof path === 'string' && path.trim().length > 0);
    this.pageNumber = 1;
    this.limit = 30;
  }

  get populateCount() {
    return this.populatePaths.length;
  }

  applyPopulate() {
    if (this.populatePaths.length > 0) {
      this.populatePaths.forEach(path => {
        this.mongooseQuery = this.mongooseQuery.populate({ path, select: '-password' });
      });
    }
  }

  pagination() {
    let pageNumber = this.query.page || 1;
    let limit = 30;

    if (this.query.page <= 0) pageNumber = 1;
    if (!(this.query.limit > 50) || (this.query.limit <= 0)) limit = this.query.limit;

    const skip = (pageNumber - 1) * limit;

    this.pageNumber = Number(pageNumber) || 1;
    this.limit = Number(limit) || 30;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit).select('-password');
    this.applyPopulate();

    return this;
  }

  sort() {
    if (this.query.sort) {
      const sortedBy = this.query.sort.split(',').join(' ');
      this.mongooseQuery.sort(sortedBy).select('-password');
      this.applyPopulate();
    }

    return this;
  }

  fields() {
    if (this.query.fields) {
      const selectedFields = this.query.fields.split(',').join(' ');
      this.mongooseQuery.select(selectedFields);
      this.applyPopulate();
    }
    return this;
  }

  search() {
    if (this.query.search) {
      const searchValue = this.query.search;
      const orConditions = [
        { companyName: { $regex: searchValue, $options: 'i' } },
        { description: { $regex: searchValue, $options: 'i' } },
        { industry: { $regex: searchValue, $options: 'i' } },
        { address: { $regex: searchValue, $options: 'i' } },
        { companyEmail: { $regex: searchValue, $options: 'i' } },
        { jobLocation: { $regex: searchValue, $options: 'i' } },
        { jobTitle: { $regex: searchValue, $options: 'i' } },
        { workingTime: { $regex: searchValue, $options: 'i' } }
      ];

      if (mongoose.Types.ObjectId.isValid(searchValue)) {
        orConditions.push({ _id: searchValue });
      }

      this.mongooseQuery.find({ $or: orConditions });
    }

    return this;
  }

  filter() {
    let filterObj = structuredClone(this.query);
    filterObj = JSON.stringify(filterObj);
    filterObj = filterObj.replace(/gt|gte|lt|lte|ne/g, value => `$${value}`);
    filterObj = JSON.parse(filterObj);

    const exlcudedFields = ['page', 'sort', 'fields', 'search', 'limit'];

    exlcudedFields.forEach(value => {
      delete filterObj[value];
    })

    this.mongooseQuery.find(filterObj);

    return this;
  }

  async getCount() {
    const countQuery = this.mongooseQuery.model.countDocuments(this.mongooseQuery.getQuery());
    return countQuery;
  }

}