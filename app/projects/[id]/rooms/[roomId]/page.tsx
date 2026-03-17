import { notFound } from "next/navigation";

import { getRoomWorkspace, listSuppliers } from "@/lib/supabase";

import { RoomWorkspaceView } from "./room-workspace";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string; roomId: string }>;
}) {
  const { id, roomId } = await params;

  const { data: room } = await getRoomWorkspace(id, roomId);
  const { data: suppliers } = await listSuppliers();

  if (!room) {
    notFound();
  }

  return <RoomWorkspaceView projectId={id} room={room} suppliers={suppliers} />;
}
