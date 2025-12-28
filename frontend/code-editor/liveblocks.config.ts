import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

/* ---------------- TYPES ---------------- */

export type Cursor = {
  lineNumber: number;
  column: number;
};

export type Presence = {
  cursor: Cursor | null;
};

/* ---------------- CLIENT ---------------- */

const client = createClient({
  publicApiKey: import.meta.env.VITE_LIVEBLOCKS_PUBLIC_KEY,
});

/* ---------------- CONTEXT ---------------- */

export const { RoomProvider, useRoom, useMyPresence, useOthers } =
  createRoomContext<Presence>(client);
