import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderMasterModule } from './provider-master/provider-master.module';
import { StationModule } from './station/station.module';
import { PlugTypeMasterModule } from './plug-type-master/plug-type-master.module';
import { AuthModule } from './auth/auth.module';
import { PlugStationModule } from './plug-station/plug-station.module';
import { ReviewModule } from './review/review.module';
import { FavoriteModule } from './favorite/favorite.module';
import { ImageTicketModule } from './image-ticket/image-ticket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NewsModule } from './interceptors/news/news.module';
import { BackOfficeModule } from './back-office/back-office.module';
@Module({
  imports: [
    PrismaModule, 
    ProviderMasterModule, 
    StationModule, 
    PlugTypeMasterModule, 
    AuthModule, 
    PlugStationModule, 
    ReviewModule, 
    FavoriteModule, 
    ImageTicketModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    NewsModule,
    BackOfficeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
