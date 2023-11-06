import React from 'react';
import { CreateServerModal } from '../modal/create-server-modal';
import { InviteModal } from '../modal/invite-modal';

export const ModalProviders = () => {
  return (
    <>
      <CreateServerModal />
      <InviteModal/>
    </>
  );
};
