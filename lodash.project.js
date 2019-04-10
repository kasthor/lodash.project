const _ = require('lodash');

module.exports = {
  project(obj, projection) {
    const replacementRegex = /\${(.*)}/;

    return _.mapValues(projection, (value) => {
      if (_.isObject(value)) {
        if ('$array' in value) {
          return _.map(_.get(obj, _.get(value, '$array')), i => _.project(i, _.get(value, '$template')));
        } else if ('$object_from_array' in value) {
          return _(_.get(obj, _.get(value, '$object_from_array')))
            .map(i => [
              _.get(i, _.get(value, '$key')),
              _.project(i, _.get(value, '$template')),
            ])
            .fromPairs()
            .value();
        } else {
          return _.project(obj, value);
        }
      } else if (_.isString(value)) {
        const m = value.match(replacementRegex);
        return m ? _.get(obj, m[1]) : value;
      } else {
        return value;
      }
    });
  },
};
