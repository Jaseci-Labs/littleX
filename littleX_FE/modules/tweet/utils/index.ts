export const cosineSimilarity = (
  vectorA: number[],
  vectorB: number[]
): number => {
  const dotProduct = vectorA.reduce((acc, val, i) => acc + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(
    vectorA.reduce((acc, val) => acc + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((acc, val) => acc + val * val, 0)
  );
  return dotProduct / (magnitudeA * magnitudeB);
};

/**
 * Calculates the time difference between a timestamp and the current time
 *
 * @param timestamp - Either a UTC timestamp in format "YYYY-MM-DD HH:MM:SS" or a Date.toUTCString() format
 * @returns A string representing the time difference (e.g., "10s ago", "5m ago", "2h ago")
 */
export const getTimeDifference = (timestamp: string): string => {
  try {
    let date: Date;

    // Check if the timestamp is in "YYYY-MM-DD HH:MM:SS" format
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(timestamp)) {
      // Convert "YYYY-MM-DD HH:MM:SS" to "YYYY-MM-DDTHH:MM:SSZ" ISO format
      const isoFormat: string = timestamp.replace(" ", "T") + "Z";
      date = new Date(isoFormat);
    } else {
      // Handle different format (including Date.toUTCString())
      date = new Date(timestamp);
    }

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date format";
    }

    const currentTime: Date = new Date();

    // Calculate time difference in seconds
    const diffInSeconds: number = Math.floor(
      Math.abs(currentTime.getTime() - date.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    }

    const diffInMinutes: number = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    const diffInHours: number = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    const diffInDays: number = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  } catch (error) {
    return "Invalid date format";
  }
};
