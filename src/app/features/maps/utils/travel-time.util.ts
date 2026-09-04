/**
 * Converts a dijkstra path's totalCost (sum of terrain moveCost per hex entered) into
 * travel time, using the same baseline as the wilderness map's display-only estimate:
 * moveCost 1 == 3 miles/hour, scale is miles-per-hex.
 */
export function computeHoursForCost(totalCost: number, scale: number): number {
  return (totalCost * scale) / 6;
}

export function computeDaysForCost(totalCost: number, scale: number, hoursPerDay = 8): number {
  return computeHoursForCost(totalCost, scale) / hoursPerDay;
}
