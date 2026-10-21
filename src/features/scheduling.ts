export interface TimeInterval {
  startTime: string;
  endTime: string;
}

export function hasTimeOverlap(
  first: TimeInterval,
  second: TimeInterval,
): boolean {
  return (
    first.startTime < second.endTime &&
    first.endTime > second.startTime
  );
}
