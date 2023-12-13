import { currentProfilePages } from '@/lib/current-profile-pages';
import { prisma } from '@/lib/db/prisma';
import { NextApiResponseServerIo } from '@/lib/types/types';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { content, serverId, messageId, channelId } = JSON.parse(req.body);
    const profile = currentProfilePages(req);

    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    if (!serverId) {
      return res.status(400).json({ error: 'Server Id missing' });
    }
    if (!messageId) {
      return res.status(400).json({ error: 'Message Id missing' });
    }
    if (!channelId) {
      return res.status(400).json({ error: 'Channel Id missing' });
    }



    let updatedMessage = await prisma.message.update({
      where: { id: messageId },
      data: { content },
      include: { member: { include: { profile: true } } },
    });

    if (req.method === 'DELETE') {
      updatedMessage = await prisma.message.update({
        where: { id: messageId },
        data: {
          fileUrl: null,
          content: 'This message has been deleted',
          deleted: true,
        },
        include: { member: { include: { profile: true } } },
      });
    }
    const updateKey = `chat:${channelId}: messages:update`;
    res?.socket?.server?.io?.emit(updateKey, updatedMessage);
    return res
      .status(200)
      .json({ updatedMessage, message: 'message updated success' });
  } catch (error) {
    console.log('[MESSAGE_ID] ', error);
    return res.status(500).json({ error: 'Internal Error' });
  }
}
