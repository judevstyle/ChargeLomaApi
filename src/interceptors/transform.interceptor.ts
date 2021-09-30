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

            let success = data?.success || true
            if(success !== undefined){
                delete data.success
            }

            return {
                statusCode: 200,
                success: success !== undefined ? success : true,
                data: data || null,
                message: data.message || undefined
            }

        }));
    }
}