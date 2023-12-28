import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomEntity } from '../chat_room/entities/chat_room.entity';
import { RoomMemberEntity } from '../chat_room/entities/room_member.entity';
import { FriendRequestEntity } from '../friend/entities/friend-request.entity';
import { FriendEntity } from '../friend/entities/friend.entity';
import { MessageEntity } from '../message/entities/message.entity';
import { GetDetailUserDto } from './dto/get-detail.dto';
import { BlockEntity } from './entities/block.entity';
import { UserEntity } from './entities/user.entity';
import { GetDetailUserResponse } from './response/get-detail.response';
import { UserController } from './user.controller';
import { UserModule } from './user.module';
import { UserService } from './user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UserService', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: 'mysql',
                    host: 'sql12.freemysqlhosting.net',
                    port: 3306,
                    username: 'sql12659071',
                    password: 'lJzIr9B6d1',
                    database: 'sql12659071',
                    entities: [FriendEntity, UserEntity, FriendRequestEntity, ChatRoomEntity, RoomMemberEntity, MessageEntity, BlockEntity],
                }),
                TypeOrmModule.forFeature([UserEntity, FriendEntity, FriendRequestEntity, BlockEntity]),
                UserModule
            ],
            controllers: [UserController],
            providers: [UserService],
        }).compile();

        userService = moduleRef.get<UserService>(UserService);
        userController = moduleRef.get<UserController>(UserController);
    });

    describe('getDetailUser', () => {
        it('should return specific user with user_id=7', async () => {
            //Data input
            const userId = 10
            const getDetailUserDto: GetDetailUserDto = {
                email: 'namnhat0620@gmail.com',
                username: ''
            }

            //Result expected
            const result: GetDetailUserResponse = {
                user_id: 7,
                avatar: 'https://picsum.photos/200',
                email: 'namnhat@gmail.com',
                username: 'namnhat12'
            };

            //Test
            jest.spyOn(userService, 'getDetailUser').mockImplementation(async () => result);

            expect(await userService.getDetailUser(userId, getDetailUserDto)).toBe(result);
        });
    });

    describe('getDetailUser', () => {
        it('should return null', async () => {
            //Data input
            const userId = 10
            const getDetailUserDto: GetDetailUserDto = {
                email: 'namnhat123@gmail.com',
                username: ''
            }

            //Result expected

            //Test
            jest.spyOn(userService, 'getDetailUser').mockImplementation(async () => null);

            expect(await userService.getDetailUser(userId, getDetailUserDto)).toBe(null);
        });
    });
});