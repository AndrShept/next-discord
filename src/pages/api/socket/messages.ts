import { currentProfilePages } from '@/lib/current-profile-pages';
import { prisma } from '@/lib/db/prisma';
import { NextApiResponseServerIo } from '@/lib/types/types';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePages(req);
    const body = req.body;
    const { serverId, channelId, content, fileUrl } = JSON.parse(body);
    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (!serverId) {
      return res.status(401).json({ message: 'Server Id  Missing' });
    }
    if (!channelId) {
      return res.status(401).json({ message: 'Channel Id  Missing' });
    }
   

    const server = await prisma.server.findFirst({
      where: {
        id: serverId,

        members: { some: { profileId: profile.id } },
      },
      include: { members: true },
    });
    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }
    const channel = await prisma.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });
    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const member = server.members.find(
      (member) => member.profileId === profile.id
    );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const newMessage = await prisma.message.create({
      data: { content, channelId, memberId: member.id, fileUrl },
    });

    const channelKey = `chat:${channelId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, newMessage);
    return res.status(200).json({ newMessage, message: 'Message created' });
  } catch (error) {
    console.log('[MESSAGES_POST]', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
