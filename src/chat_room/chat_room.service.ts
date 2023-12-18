import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatRoomEntity } from './entities/chat_room.entity';
import { Repository } from 'typeorm';
import { CreateChatRoomDto } from './dto/create-chat_room.dto';
import { UserService } from '../user/user.service';
import { RoomMemberEntity } from './entities/room_member.entity';
import { PaginationDto } from '../utils/dto/pagination.dto';
import { GetChatRoomDetailResponse, GetListChatRoomResponsePagination } from './response/get-list-chat_room.response';
import { AddMemberDto } from './dto/add_member.dto';

@Injectable()
export class ChatRoomService {
  constructor(
    @InjectRepository(ChatRoomEntity)
    private chatRoomRepository: Repository<ChatRoomEntity>,

    @InjectRepository(RoomMemberEntity)
    private roomMemberRepository: Repository<RoomMemberEntity>,

    private readonly userService: UserService,
  ) { }

  async createChatRoom(user_id: number, createChatRoomDto: CreateChatRoomDto) {
    const listMembers = [...new Set([user_id, ...createChatRoomDto.user_id])];
    //Kiểm tra user hợp lệ
    await this.userService.checkUsers(listMembers);

    //Tạo nhóm
    const newChatRoom = this.chatRoomRepository.create({
      room_name: createChatRoomDto.name,
      avatar: createChatRoomDto.avatar,
      date_created: new Date()
    });
    await this.chatRoomRepository.save(newChatRoom);

    //Lưu các thành viên nhóm
    await Promise.all(listMembers.map(async memberId => {
      const newRoomMember = this.roomMemberRepository.create({ chat_room: newChatRoom, user_id: memberId });
      await this.roomMemberRepository.save(newRoomMember);
    }))
  }

  async getListChatRoom(user_id: number, getListChatRoom: PaginationDto) {
    //Kiểm tra user hợp lệ
    await this.userService.checkUsers([user_id]);

    //Lấy điều kiện client
    const page = +getListChatRoom.page || 1;
    const limit = +getListChatRoom.limit || 20;
    const skip = (page - 1) * limit;

    //Lấy ds room chat
    const [listRoomMember, total_record] = await this.roomMemberRepository.findAndCount({
      where: { user_id },
      relations: { chat_room: { last_message: { user: true } } },
      take: limit,
      skip
    })

    const list = listRoomMember.map(roomMember => new GetChatRoomDetailResponse(roomMember.chat_room));
    return { limit, total_record, list };
  }

  async addMemberChatRoom(user_id: number, addMemberDto: AddMemberDto) {
    const { user_id_add, room_id } = addMemberDto

    //Check user valid
    await this.userService.checkUsers([user_id, user_id_add])

    //Check if user is in room 
    await this.getChatRoom(user_id, room_id)

    const userToAddInRoom = await this.roomMemberRepository.findOneBy({
      room_id,
      user_id: user_id_add
    })
    if (userToAddInRoom) throw new HttpException('Người dùng này đã là thành viên nhóm chat', HttpStatus.BAD_REQUEST)

    //Thêm user vào nhóm chat
    const newUserInRoom = this.roomMemberRepository.create({
      room_id,
      user_id: user_id_add
    })
    await this.roomMemberRepository.save(newUserInRoom)
  }

  async leaveChatRoom(user_id: number, room_id: number) {
    //Check user valid
    await this.userService.checkUsers([user_id])

    //Check if user in room
    await this.getChatRoom(user_id, room_id)

    //Leave
    await this.roomMemberRepository.delete({
      user_id,
      room_id
    })
  }
  //============SUPPORT FUNCTION=================//

  /*
  * Lấy danh sách member trong phòng
  */
  async getChatRoom(user_id: number, room_id: number): Promise<ChatRoomEntity> {
    if (!user_id || !room_id) return;
    const roomMember = await this.roomMemberRepository.findOne({
      where: { user_id, room_id },
      relations: { chat_room: { room_member: true } }
    });
    if (!roomMember) throw new HttpException('User không phải là thành viên cuộc trò chuyện', HttpStatus.FORBIDDEN)
    return roomMember.chat_room;
  }
}