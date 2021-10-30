import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { TransformInterceptor } from '../transform.interceptor';
import { FindNews } from './news.dto';
import { NewsService } from './news.service';

@UseInterceptors(TransformInterceptor)
@Controller('information')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  async information(@Query() query: FindNews) {
    return this.newsService.findAllNews(query)
  }
}
