export const DEFAULT_CHAT_MODEL: string = "chat-model-claude";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model-claude",
    name: "Claude Sonnet 4.5",
    description: "Anthropic's most capable model for complex reasoning",
  },
  {
    id: "chat-model-gemini",
    name: "Gemini 2.0 Flash",
    description: "Google's fast multimodal model",
  },
];
