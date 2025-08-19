import { useState, useCallback } from "react";

export function useMyCompletion(endpoint: string) {
  const [completion, setCompletion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  console.log(prompt);

  const complete = useCallback(
    async (prompt: string, options?: any) => {
      setCompletion("");
      setIsLoading(true);

      const res = await fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ prompt, ...options.body }),
      });

      if (!res.body) {
        setIsLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });

        // Each chunk may contain multiple SSE events
        const lines = chunk
          .split("\n")
          .filter((l) => l.trim().startsWith("data:"));
        for (const line of lines) {
          const json = line.replace(/^data:\s*/, "");
          if (json === "[DONE]") break;

          try {
            const parsed = JSON.parse(json);
            const token = parsed?.choices?.[0]?.delta?.content || "";
            setCompletion((prev) => prev + token);
          } catch (e) {
            console.error("Parse error:", e, line);
          }
        }
      }

      setIsLoading(false);
    },
    [endpoint]
  );

  return { completion, complete, isLoading };
}
