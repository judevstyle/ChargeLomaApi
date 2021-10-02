import { Body, Controller, Get, Param, Post, Put, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { FindAll, ParamFindOne, PostReview } from './review.dto';
import { ReviewService } from './review.service';
@Controller('review')
@UseInterceptors(TransformInterceptor)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(AuthGuard(['user']))
  @Post()
  async postReview(@Request() req,@Body() body:PostReview){
    const USER = req.user

    return this.reviewService.postReview(USER.uid,body)
  }

  @UseGuards(AuthGuard(['user']))
  @Put(':ck_id')
  async updateReview(@Request() req,@Body() body:PostReview,@Param() param:ParamFindOne){
    const USER = req.user

    return this.reviewService.updateReview(USER.uid,body,param.ck_id)
  }

  @UseGuards(AuthGuard(['user']))
  @Get()
  async getReview(@Request() req,@Query() query:FindAll){
    const USER = req.user

    return this.reviewService.getReview(query)
  }
}
