import * as _ from 'lodash'

interface Meta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

type ResponseFrom = 'DB' | 'DATA'

export interface ParameterPagination {
    data: any[]
    page: number
    limit: number
    responseFrom: ResponseFrom
    totalItems: number
}

export interface ResponsePagination {
    data: any[]
    meta: Meta
}

export const pagination = (param: ParameterPagination):ResponsePagination => {

    const { responseFrom, data, totalItems, limit, page } = param

    console.log(data.length);
    

    let totalPage = Math.ceil(totalItems / limit)

    if (responseFrom == 'DB') {
        return {
            data:data,
            meta:{
                totalItems: totalItems,
                itemCount: data.length,
                itemsPerPage: +limit,
                totalPages: totalPage,
                currentPage: page
            }
        }
    }


    if (responseFrom == 'DATA') {
        return {
            data:data.slice((page - 1) * limit, page * limit),
            meta:{
                totalItems: totalItems,
                itemCount: data.length,
                itemsPerPage: +limit,
                totalPages: totalPage,
                currentPage: page
            }
        }
    }

}