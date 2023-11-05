import { Channel, Member, Profile, Server } from '@prisma/client';

export type ServerWithMembersWithProfile = Server & {
  member: Member[]
 
};

export interface ServerWithMembers extends Server {
  member: Member[]
 
}
