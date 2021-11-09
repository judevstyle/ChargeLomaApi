import * as _ from 'lodash'

export const removeEmptyObjects = (obj:object) => {
    return _(obj)
        .pickBy(_.isObject) // pick objects only
        .mapValues(removeEmptyObjects) // call only for object values
        .omitBy(_.isEmpty) // remove all empty objects
        .assign(_.omitBy(obj, _.isObject)) // assign back primitive values
        .value();
}

export const removeDeleteRow = (obj:any) => {

    // console.log("Obj",obj);
    
    
    if(typeof obj == 'object' && !Array.isArray(obj)){
        for(const [key,value] of Object.entries(obj)){
            // console.log(key);
            
            if(Array.isArray(obj[key])){
                obj[key] = obj[key].filter((item)=>{
                    if(item.hasOwnProperty("deleted")){
                        return item.deleted == false
                    }else{
                        return true
                    }
                 
                })
                // if(key=='deleted' && obj[key] == true){

                // }
            }else{
                if(obj[key])
                obj[key] = removeDeleteRow(obj[key])
            }
        }
    }
    
    else{
        if(obj && obj.hasOwnProperty("deleted") && obj['deleted'] == true){
            return null
        }
    }

    return obj

    // if(Array.isArray(obj)){

    // }
}
