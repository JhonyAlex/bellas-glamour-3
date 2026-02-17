/**
 * Database retry wrapper for Spaceship shared hosting
 * Handles connection issues with exponential backoff
 */

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  initialDelay: number = 100
): Promise<T> {
  let lastError: Error | null = null;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // Don't retry on specific errors
      const message = (error as any)?.message || '';
      if (message.includes('PANIC') || message.includes('timer has gone away')) {
        // These are fatal - don't retry
        throw error;
      }

      if (attempt < maxAttempts) {
        // Exponential backoff with jitter
        const jitter = Math.random() * delay * 0.1;
        await new Promise(resolve => setTimeout(resolve, delay + jitter));
        delay *= 2;
      }
    }
  }

  throw lastError || new Error('Max retry attempts reached');
}
