import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export type ChatGPTAgent = "user" | "system";

export interface ChatGPTMessage {
  role: ChatGPTAgent;
  content: string;
}

export interface TogetherAIStreamPayload {
  model: string;
  messages: ChatGPTMessage[];
  stream: boolean;
}

export async function TogetherAIStream(payload: TogetherAIStreamPayload) {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  try {
    const response = await fetch("https://together.helicone.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Helicone-Auth": `Bearer ${process.env.HELICONE_API_KEY || ""}`,
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY || ""}`,
      },
      body: JSON.stringify({
        ...payload,
        stream: true,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new ReadableStream({
      async start(controller) {
        // Initialize the parser
        const parser = createParser((event: ParsedEvent | ReconnectInterval) => {
          if (event.type === "event") {
            try {
              const data = event.data;

              // Check if we're done
              if (data === "[DONE]") {
                controller.close();
                return;
              }

              // Parse the data
              const json = JSON.parse(data);
              const text = json.choices?.[0]?.delta?.content || "";
              
              // Send the chunk
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            } catch (e) {
              console.error("Error parsing chunk:", e);
              controller.error(e);
            }
          }
        });

        // Read the response body
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("Response body is null");
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            parser.feed(decoder.decode(value));
          }
        } catch (e) {
          console.error("Error reading stream:", e);
          controller.error(e);
        }
      },

      cancel() {
        // Optional: Add any cleanup here
        console.log("Stream cancelled");
      }
    });
  } catch (e) {
    console.error("Stream creation error:", e);
    throw e;
  }
}