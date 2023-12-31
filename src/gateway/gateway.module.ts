import { Module } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { GatewayGateway } from './gateway.gateway';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomService } from '../chat_room/chat_room.service';
import { ChatRoomEntity } from '../chat_room/entities/chat_room.entity';
import { RoomMemberEntity } from '../chat_room/entities/room_member.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { MessageEntity } from '../message/entities/message.entity';
import { MessageService } from '../message/message.service';
import { FriendEntity } from '../friend/entities/friend.entity';
import { FriendRequestEntity } from '../friend/entities/friend-request.entity';
import { BlockEntity } from '../user/entities/block.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChatRoomEntity, RoomMemberEntity, MessageEntity,
      FriendEntity, FriendRequestEntity, BlockEntity]),
    CacheModule.register(),
  ],
  providers: [GatewayGateway, GatewayService, UserService, ChatRoomService, MessageService],
})
export class GatewayModule { }
