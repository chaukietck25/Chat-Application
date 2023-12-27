import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entities/user.entity';
import { UserModule } from './user/user.module';
import { ValidationPipe } from './utils/validator/validation.pipe';
import { FriendModule } from './friend/friend.module';
import { FriendEntity } from './friend/entities/friend.entity';
import { FriendRequestEntity } from './friend/entities/friend-request.entity';
import { ChatRoomModule } from './chat_room/chat_room.module';
import { ChatRoomEntity } from './chat_room/entities/chat_room.entity';
import { RoomMemberEntity } from './chat_room/entities/room_member.entity';
import { MessageModule } from './message/message.module';
import { MessageEntity } from './message/entities/message.entity';
import { GatewayModule } from './gateway/gateway.module';
import { CacheModule } from '@nestjs/cache-manager';
import { UploadModule } from './upload/upload.module';
import { BlockEntity } from './user/entities/block.entity';
import { config } from 'dotenv';
config(); // Loads the environment variables from .env

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DBNAME,
      entities: [FriendEntity, UserEntity, FriendRequestEntity, ChatRoomEntity, RoomMemberEntity, MessageEntity, BlockEntity],
    }),
    CacheModule.register(),
    UserModule,
    FriendModule,
    ChatRoomModule,
    MessageModule,
    GatewayModule,
    UploadModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule { }
