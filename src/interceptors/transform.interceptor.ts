import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    statusCode: number,
    data: T;
    success: boolean
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        // let success = data.success
        return next.handle().pipe(map(data => {

            let itemResponse = data
            let meta = undefined

            let success = data?.success || true
            if (success !== undefined) {
                delete data.success
            }

            if (typeof data == 'object' && data.hasOwnProperty("data")) {
                itemResponse = data.data
            }

            if (typeof data == 'object' && data.hasOwnProperty("meta")) {
                meta = data.meta
            }

            return {
                statusCode: 200,
                success: success !== undefined ? success : true,
                data: itemResponse || null,
                message: data.message || undefined,
                meta
            }

        }));
    }
}