import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";
import { BACKEND_URL } from "./src/config";
import { getToken } from "./src/utils/token";

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
  authEndpoint: async (room) => {
    const token = getToken();
    if (!token) {
      return { error: "forbidden", reason: "Missing auth token" };
    }

    const response = await fetch(`${BACKEND_URL}/api/liveblocks/auth`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ room }),
    });

    return response.json();
  },
});

/* ---------------- CONTEXT ---------------- */

export const { RoomProvider, useRoom, useMyPresence, useOthers } =
  createRoomContext<Presence>(client);
