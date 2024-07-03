import { ConsoleLogger, ConsoleLoggerOptions, LogLevel } from '@nestjs/common';

export class AppLogger extends ConsoleLogger {
  appName = 'app_nj';

  constructor(options: ConsoleLoggerOptions) {
    super();
    this.context = this.appName;
    this.options = options;
  }

  override formatPid(pid: number): string {
    return `[${this.appName}] ${pid}  - `;
  }

  override setLogLevels(levels: LogLevel[] = ['verbose']): void {
    this.options.logLevels = levels;
  }
}
