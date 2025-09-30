"use client";

import { cn } from "@/lib/utils";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import type { HTMLAttributes } from "react";
import ReactMarkdown, { type Options } from "react-markdown";
import remarkGfm from "remark-gfm";

export type StreamingAIResponseProps = HTMLAttributes<HTMLDivElement> & {
  textStream: string;
  speed?: number;
  fadeDuration?: number;
  segmentDelay?: number;
  onComplete?: () => void;
  options?: Options;
};

const components: Options["components"] = {
  p: ({ children }) => <p>{children}</p>,
  pre: ({ children }) => <div>{children}</div>,
  ol: ({ node, children, className, ...props }) => (
    <ol className={cn("ml-4 list-outside list-decimal", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, className, ...props }) => (
    <li className={cn("py-1", className)} {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, className, ...props }) => (
    <ul className={cn("ml-4 list-outside list-disc", className)} {...props}>
      {children}
    </ul>
  ),
  strong: ({ node, children, className, ...props }) => (
    <span className={cn("font-semibold", className)} {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, className, ...props }) => (
    <a
      className={cn("font-medium text-primary underline", className)}
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  h1: ({ node, children, className, ...props }) => (
    <h1
      className={cn("mt-6 mb-2 font-semibold text-3xl", className)}
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ node, children, className, ...props }) => (
    <h2
      className={cn("mt-6 mb-2 font-semibold text-2xl", className)}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ node, children, className, ...props }) => (
    <h3 className={cn("mt-6 mb-2 font-semibold text-xl", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, className, ...props }) => (
    <h4 className={cn("mt-6 mb-2 font-semibold text-lg", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, className, ...props }) => (
    <h5
      className={cn("mt-6 mb-2 font-semibold text-base", className)}
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ node, children, className, ...props }) => (
    <h6 className={cn("mt-6 mb-2 font-semibold text-sm", className)} {...props}>
      {children}
    </h6>
  ),
  table: ({ children }) => (
    <table className="w-full table-auto border-collapse border border-gray-300">
      {children}
    </table>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-100 text-left text-nowrap">{children}</thead>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => (
    <tr className="border-b border-gray-300">{children}</tr>
  ),
  th: ({ children }) => (
    <th className="border border-gray-300 px-3 py-2 font-semibold">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-300 px-3 py-2">{children}</td>
  ),
};

interface UseStreamingMarkdownOptions {
  textStream: string;
  speed?: number;
  fadeDuration?: number;
  segmentDelay?: number;
  onComplete?: () => void;
}

function useStreamingMarkdown({
  textStream,
  speed = 30,
  fadeDuration = 500,
  segmentDelay = 60,
  onComplete,
}: UseStreamingMarkdownOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [segments, setSegments] = useState<{ text: string; index: number }[]>(
    []
  );

  const currentIndexRef = useRef(0);
  const animationRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset when textStream changes
  useEffect(() => {
    currentIndexRef.current = 0;
    setDisplayedText("");
    setSegments([]);
    setIsComplete(false);
    completedRef.current = false;

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, [textStream]);

  // Create segments from the current displayed text
  const updateSegments = useCallback((text: string) => {
    try {
      const segmenter = new Intl.Segmenter("en", { granularity: "word" });
      const segmentIterator = segmenter.segment(text);
      const newSegments = Array.from(segmentIterator).map((segment, index) => ({
        text: segment.segment,
        index,
      }));
      setSegments(newSegments);
    } catch (error) {
      // Fallback for browsers that don't support Intl.Segmenter
      const newSegments = text
        .split(/(\s+)/)
        .filter(Boolean)
        .map((word, index) => ({
          text: word,
          index,
        }));
      setSegments(newSegments);
    }
  }, []);

  // Mark streaming as complete
  const markComplete = useCallback(() => {
    if (!completedRef.current) {
      completedRef.current = true;
      setIsComplete(true);
      onComplete?.();
    }
  }, [onComplete]);

  // Stream text character by character
  useEffect(() => {
    if (!textStream) return;

    let lastFrameTime = 0;
    const delay = Math.max(1, Math.round(100 / Math.sqrt(speed)));

    const streamContent = (timestamp: number) => {
      if (timestamp - lastFrameTime < delay) {
        animationRef.current = requestAnimationFrame(streamContent);
        return;
      }
      lastFrameTime = timestamp;

      if (currentIndexRef.current >= textStream.length) {
        markComplete();
        return;
      }

      // Add characters in chunks for smoother animation
      const chunkSize = Math.max(1, Math.round(speed / 10));
      const endIndex = Math.min(
        currentIndexRef.current + chunkSize,
        textStream.length
      );
      const newDisplayedText = textStream.slice(0, endIndex);

      setDisplayedText(newDisplayedText);
      updateSegments(newDisplayedText);

      currentIndexRef.current = endIndex;

      if (endIndex < textStream.length) {
        animationRef.current = requestAnimationFrame(streamContent);
      } else {
        markComplete();
      }
    };

    animationRef.current = requestAnimationFrame(streamContent);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [textStream, speed, updateSegments, markComplete]);

  return {
    displayedText,
    isComplete,
    segments,
    fadeDuration,
    segmentDelay,
    containerRef,
  };
}

export const StreamingAIResponse = memo(
  ({
    textStream,
    speed = 30,
    fadeDuration = 500,
    segmentDelay = 60,
    onComplete,
    className,
    options,
    ...props
  }: StreamingAIResponseProps) => {
    const {
      displayedText,
      segments,
      fadeDuration: computedFadeDuration,
      segmentDelay: computedSegmentDelay,
    } = useStreamingMarkdown({
      textStream,
      speed,
      fadeDuration,
      segmentDelay,
      onComplete,
    });

    // Create fade animation styles
    const fadeStyle = `
      @keyframes fadeInWord {
        from { 
          opacity: 0;
          transform: translateY(10px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .fade-word {
        display: inline-block;
        opacity: 0;
        animation: fadeInWord ${computedFadeDuration}ms ease-out forwards;
      }

      .fade-word-space {
        white-space: pre;
      }
    `;

    // Custom components that apply fade animation to text nodes
    const animatedComponents: Options["components"] = {
      ...components,
      // Override text rendering to apply fade animation
      p: ({ children }) => (
        <p>
          {typeof children === "string" ? (
            <AnimatedText
              text={children}
              segments={segments}
              segmentDelay={computedSegmentDelay}
            />
          ) : (
            children
          )}
        </p>
      ),
      span: ({ children }) => (
        <span>
          {typeof children === "string" ? (
            <AnimatedText
              text={children}
              segments={segments}
              segmentDelay={computedSegmentDelay}
            />
          ) : (
            children
          )}
        </span>
      ),
      strong: ({ node, children, className, ...props }) => (
        <span className={cn("font-semibold", className)} {...props}>
          {typeof children === "string" ? (
            <AnimatedText
              text={children}
              segments={segments}
              segmentDelay={computedSegmentDelay}
            />
          ) : (
            children
          )}
        </span>
      ),
      li: ({ node, children, className, ...props }) => (
        <li className={cn("py-1", className)} {...props}>
          {typeof children === "string" ? (
            <AnimatedText
              text={children}
              segments={segments}
              segmentDelay={computedSegmentDelay}
            />
          ) : (
            children
          )}
        </li>
      ),
    };

    return (
      <div
        className={cn(
          "size-full [&>*:first-child]:mt-0 text-pretty [&>*:last-child]:mb-0",
          className
        )}
        {...props}
      >
        <style>{fadeStyle}</style>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={animatedComponents}
          {...options}
        >
          {displayedText}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.textStream === nextProps.textStream
);

// Component to handle animated text rendering
interface AnimatedTextProps {
  text: string;
  segments: { text: string; index: number }[];
  segmentDelay: number;
}

const AnimatedText = memo(
  ({ text, segments, segmentDelay }: AnimatedTextProps) => {
    // Find segments that match the current text
    const relevantSegments = segments.filter((segment) =>
      text.includes(segment.text)
    );

    if (relevantSegments.length === 0) {
      return <span className="fade-word">{text}</span>;
    }

    return (
      <>
        {relevantSegments.map((segment, idx) => {
          const isWhitespace = /^\s+$/.test(segment.text);

          return (
            <span
              key={`${segment.text}-${segment.index}`}
              className={cn("fade-word", isWhitespace && "fade-word-space")}
              style={{
                animationDelay: `${segment.index * segmentDelay}ms`,
              }}
            >
              {segment.text}
            </span>
          );
        })}
      </>
    );
  }
);

AnimatedText.displayName = "AnimatedText";
StreamingAIResponse.displayName = "StreamingAIResponse";
