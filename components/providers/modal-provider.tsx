"use client";

import React, { useEffect, useState } from "react";
import CreateServerModal from "../modals/create-server-modal";
import InviteModal from "../modals/invite-modal";
import EditServerModal from "../modals/edit-server-modal";
import MembersModal from "../modals/members-modal";

type Props = {};

const ModalProvider = (props: Props) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    return () => {};
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
    </>
  );
};

export default ModalProvider;
