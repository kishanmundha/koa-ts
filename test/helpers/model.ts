import * as Mongoose from 'mongoose';

export const MockModel = (data) => {
  function Model(document) {
    if (document) {
      Object.keys(document).forEach((key) => {
        this[key] = document[key];
      });
    }

    this.toJSON = () => {
      const jsonObj = {};
      const blackListKeys = ['toJSON'];
      Object.keys(this).forEach((key) => {
        if (blackListKeys.indexOf(key) !== -1) {
          return;
        }

        jsonObj[key] = JSON.parse(JSON.stringify(this[key]));
      });

      return jsonObj;
    };
  }

  Model.prototype.save = async () => {
    // Models.push(this.document);
  };

  Model.prototype.remove = async () => {
    // Models.push(this.document);
  };

  (Model as any).find = async (condition) => {
    if (!condition || Object.keys(condition).length === 0) {
      return data;
    }

    return data.filter((x) => {
      return Object.keys(condition).every((key) => {
        if (x[key] instanceof Mongoose.Types.ObjectId) {
          return (x[key] as Mongoose.Types.ObjectId).equals(condition[key]);
        }

        return condition[key] === x[key];
      });
    }).map((x) => new Model(x));
  };

  (Model as any).findOne = async (condition) => {
    const result = await (Model as any).find(condition);
    return result[0] || null;
  };

  (Model as any).findById = async (id) => {
    const record = data.find((x) => x._id.equals(id));

    if (record) {
      return new Model(record);
    }

    return null;
  };

  return Model;
};
