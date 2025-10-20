import { useState, useEffect } from "react";
import * as yaml from "js-yaml";

interface ParseResult {
  valid: boolean;
  data?: any;
  error?: string;
}

interface UseYamlParserOptions {
  debounceMs?: number;
}

export function useYamlParser(
  yamlString: string,
  options: UseYamlParserOptions = {}
): { parseResult: ParseResult; isParsing: boolean } {
  const [parseResult, setParseResult] = useState<ParseResult>({ valid: false });
  const [isParsing, setIsParsing] = useState(false);

  const { debounceMs = 300 } = options;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsParsing(true);
      
      try {
        const data = yaml.load(yamlString);
        setParseResult({ valid: true, data });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        setParseResult({ valid: false, error: errorMessage });
      } finally {
        setIsParsing(false);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [yamlString, debounceMs]);

  return { parseResult, isParsing };
}
