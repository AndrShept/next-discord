import { Channel, Member, Profile, Server } from '@prisma/client';

// interface MemberWithProfile extends Member {
//   profile: Profile;
// }

export type ServerWithMembersWithProfile = Server & {
  members: (Member & {profile :Profile})[]
  profiles: Profile
 
};

export interface ServerWithMembers extends Server {
  members: Member[]
 
}
