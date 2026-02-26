export const logger = {
  async log(level: 'INFO' | 'WARN' | 'ERROR', message: string, details?: any) {
    console.log(`[FE-${level}] ${message}`, details || '');
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: 'FE', level, message, details }),
      });
    } catch (e) {
      console.error('Logging failed', e);
    }
  }
};
