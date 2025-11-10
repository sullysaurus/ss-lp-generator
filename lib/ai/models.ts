export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Grok Vision",
    description: "Advanced multimodal model with vision and text capabilities",
  },
  {
    id: "chat-model-reasoning",
    name: "Grok Reasoning",
    description:
      "Uses advanced chain-of-thought reasoning for complex problems",
  },
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
