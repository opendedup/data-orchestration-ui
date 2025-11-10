/**
 * Custom message renderer that appends a thinking indicator beneath the latest user message.
 */

"use client";

import type { CSSProperties, JSX } from "react";
import type { RenderMessageProps } from "@copilotkit/react-ui";
import {
  AssistantMessage as DefaultAssistantMessage,
  UserMessage as DefaultUserMessage,
  ImageRenderer as DefaultImageRenderer,
} from "@copilotkit/react-ui";

/**
 * Render a chat message with an optional thinking indicator for the most recent user prompt.
 */
export default function ChatMessageRenderer(props: RenderMessageProps): JSX.Element | null {
  const {
    message,
    inProgress,
    isCurrentMessage,
    UserMessage = DefaultUserMessage,
    AssistantMessage = DefaultAssistantMessage,
    ImageRenderer = DefaultImageRenderer,
    onRegenerate,
    onCopy,
    onThumbsUp,
    onThumbsDown,
    markdownTagRenderers,
  } = props;

  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-2">
        <UserMessage
          rawData={message}
          message={message}
          ImageRenderer={ImageRenderer}
        />
        {inProgress && isCurrentMessage && (
          <div
            className="thinking-indicator thinking-indicator--user"
            role="status"
            aria-live="polite"
            aria-label="Assistant is thinking"
          >
            {[0, 0.2, 0.4].map((delay) => (
              <span
                key={`thinking-indicator-dot-${delay}`}
                className="thinking-indicator-dot"
                style={{ animationDelay: `${delay}s` } as CSSProperties}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (message.role === "assistant") {
    return (
      <AssistantMessage
        data-message-role="assistant"
        subComponent={message.generativeUI?.()}
        rawData={message}
        message={message}
        isLoading={inProgress && isCurrentMessage && !message.content}
        isGenerating={inProgress && isCurrentMessage && !!message.content}
        isCurrentMessage={isCurrentMessage}
        onRegenerate={() => onRegenerate?.(message.id)}
        onCopy={onCopy}
        onThumbsUp={onThumbsUp}
        onThumbsDown={onThumbsDown}
        markdownTagRenderers={markdownTagRenderers}
        ImageRenderer={ImageRenderer}
      />
    );
  }

  return null;
}


