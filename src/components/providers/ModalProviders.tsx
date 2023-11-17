import React from 'react';
import { CreateServerModal } from '../modal/create-server-modal';
import { InviteModal } from '../modal/invite-modal';
import { EditServerModal } from '../modal/edit-server-modal';
import { MembersModal } from '../modal/members-modal';
import { CreateChannelModal } from '../modal/create-channel-modal';

export const ModalProviders = () => {
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal/>
    </>
  );
};
