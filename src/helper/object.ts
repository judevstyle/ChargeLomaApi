import * as _ from 'lodash'

export const removeEmptyObjects = (obj:object) => {
    return _(obj)
        .pickBy(_.isObject) // pick objects only
        .mapValues(removeEmptyObjects) // call only for object values
        .omitBy(_.isEmpty) // remove all empty objects
        .assign(_.omitBy(obj, _.isObject)) // assign back primitive values
        .value();
}
