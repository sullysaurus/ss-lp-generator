import { gateway } from "@ai-sdk/gateway";
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model-claude": wrapLanguageModel({
          model: gateway.languageModel("claude-sonnet-4.5"),
          middleware: extractReasoningMiddleware({ tagName: "thinking" }),
        }),
        "chat-model-gemini": gateway.languageModel("gemini-2.0-flash-lite"),
        "title-model": gateway.languageModel("claude-sonnet-4.5"),
        "artifact-model": gateway.languageModel("claude-sonnet-4.5"),
      },
    });
