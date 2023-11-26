import React from 'react';
import { CreateServerModal } from '../modal/create-server-modal';
import { InviteModal } from '../modal/invite-modal';
import { EditServerModal } from '../modal/edit-server-modal';
import { MembersModal } from '../modal/members-modal';
import { CreateChannelModal } from '../modal/create-channel-modal';
import { LeaveSeverModal } from '../modal/leave-server-modal';
import { DeleteSeverModal } from '../modal/delete-server-modal';
import { DeleteChannelModal } from '../modal/delete-channel-modal';
import { EditChannelModal } from '../modal/edit-channel-modal';

export const ModalProviders = () => {
  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveSeverModal />
      <DeleteSeverModal />
      <DeleteChannelModal />
      <EditChannelModal />
    </>
  );
};
