import { Controller, Get, Query } from '@nestjs/common';
import { FindNews } from './news.dto';
import { NewsService } from './news.service';

@Controller('information')
export class NewsController {
  constructor(private readonly newsService: NewsService) { }

  @Get()
  async information(@Query() query: FindNews) {
    return this.newsService.findAllNews(query)
  }
}
