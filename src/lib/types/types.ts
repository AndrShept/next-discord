import { Channel, Member, Profile, Server } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIoServer } from 'socket.io';

// interface MemberWithProfile extends Member {
//   profile: Profile;
// }

export type ServerWithMembersWithProfile = Server & {
  members: (Member & { profile: Profile | null })[];
  channels: (Channel & { profile?: Profile })[];
  profile?: Profile;
};

export interface ServerWithMembers extends Server {
  members: Member[];
}

export interface NextApiResponseServerIo extends NextApiResponse {
  socket: Socket & { server: NetServer & { io: SocketIoServer } };
}
