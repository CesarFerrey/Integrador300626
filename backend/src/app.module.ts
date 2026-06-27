import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { GestionModule } from './modules/gestion/gestion.module';


@Module({
  imports: [ConfigModule.forRoot({ 
    isGlobal: true,
  }),

    AuthModule,
    GestionModule,

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
      logging: process.env.DB_LOGGING === 'true',
      logger: 'advanced-console',
  })],

      
  controllers: [AppController],
  providers: [AppService],
  exports: []
})
export class AppModule {
  
  }


