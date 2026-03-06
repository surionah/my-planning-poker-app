import { RoomEntity } from '../entities/room.entity';

export interface IRoomRepository {
  create(data: { name: string; code: string }): Promise<RoomEntity>;
  findByCode(code: string): Promise<RoomEntity | null>;
  findById(id: string): Promise<RoomEntity | null>;
}

export const ROOM_REPOSITORY = 'ROOM_REPOSITORY';
