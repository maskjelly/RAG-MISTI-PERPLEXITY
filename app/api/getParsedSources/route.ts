import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";
import { cleanedText, fetchWithTimeout } from "@/utils/utils";
import { NextResponse } from "next/server";

interface Source {
  url: string;
  name: string;
  [key: string]: any;
}

interface ParsedResult extends Source {
  fullContent: string;
  error?: string;
}

export const maxDuration = 60;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    if (!body.sources || !Array.isArray(body.sources)) {
      return NextResponse.json(
        { error: "Invalid input: sources must be an array" },
        { status: 400 }
      );
    }

    const { sources } = body;
    
    console.log("[getAnswer] Fetching text from source URLS");
    
    const finalResults: ParsedResult[] = await Promise.all(
      sources.map(async (result: Source) => {
        try {
          if (!result.url) {
            throw new Error("URL is required");
          }

          // Fetch the source URL, or abort if it's been 3 seconds
          const response = await fetchWithTimeout(result.url);
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const html = await response.text();
          
          // Create virtual console to suppress JSDOM warnings
          const virtualConsole = new jsdom.VirtualConsole();
          virtualConsole.on("error", () => { /* suppress errors */ });
          
          const dom = new JSDOM(html, { virtualConsole });
          const doc = dom.window.document;
          
          const reader = new Readability(doc);
          const parsed = reader.parse();

          if (!parsed) {
            throw new Error("Failed to parse content");
          }

          const parsedContent = cleanedText(parsed.textContent);

          return {
            ...result,
            fullContent: parsedContent || "Empty content",
          };
        } catch (e) {
          console.error(`Error parsing ${result.name}:`, e);
          return {
            ...result,
            fullContent: "not available",
            error: e instanceof Error ? e.message : "Unknown error occurred"
          };
        }
      })
    );

    return NextResponse.json(finalResults);
    
  } catch (e) {
    console.error("Server error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}