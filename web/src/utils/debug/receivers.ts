import type { DebugEventCallback } from "@/typings/events";
import { DebugEventReceive } from "@/utils/eventsHandlers";
import {
  mockConversations,
  mockContacts,
  mockFavorites,
  mockRecentCalls,
} from "./mockDatas";

/**
 * These Receivers will emulate what the client receives from the UI.
 * The purpose of this is to test the UI without having to run the client.
 * You are supposed to pretend to process the data you receive here and return.
 */
const ReceiveDebuggers: DebugEventCallback[] = [
  {
    action: "messages:fetchConversation",
    handler: (conversationId: string) => {
      return (
        mockConversations[conversationId] || {
          id: conversationId,
          name: "Unknown",
          messages: [
            {
              sender: "system",
              content: "No messages found",
              timestamp: new Date().toISOString(),
            },
          ],
        }
      );
    },
  },
  {
    action: "messages:fetchRecents",
    handler: () => {
      return [
        {
          id: "1",
          name: "Alice",
          lastMessage: "Hey, how are you?",
          lastMessageTime: "10:30 AM",
        },
        {
          id: "2",
          name: "Bob",
          lastMessage: "See you later!",
          lastMessageTime: "Yesterday",
        },
      ];
    },
  },
  {
    action: "contacts:fetch",
    handler: () => {
      return mockContacts;
    },
  },
  {
    action: "favorites:fetch",
    handler: () => {
      return mockFavorites;
    },
  },
  {
    action: "recentCalls:fetch",
    handler: () => {
      return mockRecentCalls;
    },
  },
  {
    action: "resource:close",
    handler: () => {
      console.log("closed");
    },
  },
  {
    action: "debug",
    handler: (data: string) => {
      const init = "Emulates an NUICallback times. Process the data here.";

      if (typeof data !== "string") {
        return `${init} \n The data is not a string.`;
      }

      const reverse = data.split("").reverse().join("");

      const message = `${init} \n The reverse of %c${data} %cis %c${reverse}`;

      return message;
    },
  },
];

export default ReceiveDebuggers;

/**
 * Initialise the debug receivers
 */
export function InitialiseDebugReceivers(): void {
  for (const debug of ReceiveDebuggers) {
    DebugEventReceive(debug.action, debug.handler);
  }
}
