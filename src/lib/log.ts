import { Log, LogCollector, LogFunction, LogLevel } from "@/types/log";
import { Record } from "@prisma/client/runtime/library";

export function CreateLogCollector(): LogCollector {
  const logs: Log[] = [];

  const getAll = () => logs;

  const LogFunctions = {} as Record<LogLevel, LogFunction>;
  LogLevel.forEach(
    (level) =>
    (LogFunctions[level] = (message: string) => {
      logs.push({ message, level, timestamp: new Date() });
    }),
  );
  return {
    getAll,
    ...LogFunctions,
  };
}
