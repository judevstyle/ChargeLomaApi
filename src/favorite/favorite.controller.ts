import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransformInterceptor } from 'src/interceptors/transform.interceptor';
import { FindOneFavorite, GetStationFavorite, PostFavorite } from './favorite.dto';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
@UseInterceptors(TransformInterceptor)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) { }

  @Post()
  @UseGuards(AuthGuard(['user']))
  async postFavorite(@Request() req, @Body() body: PostFavorite) {
    const USER = req.user

    return this.favoriteService.postFavorite(USER.uid, body)
  }

  @Get('stationFavorite')
  @UseGuards(AuthGuard(['user']))
  async stationFavorite(@Request() req,@Query() query:GetStationFavorite) {
    const USER = req.user

    return this.favoriteService.getStationFavorite(USER.uid,query)
  }

  
  @Delete(':fav_id')
  @UseGuards(AuthGuard(['user']))
  async deleteFavorite(@Request() req, @Param() param: FindOneFavorite) {
    const USER = req.user

    return this.favoriteService.deleteFavorite(param)
  }
}
