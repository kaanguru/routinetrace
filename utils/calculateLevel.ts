const LEVEL_PER_POINT = 50;
const HEALTH_WEIGHT = 0.6;
const HAPPINESS_WEIGHT = 0.4;

export default function calculateLevel(
  health: number,
  happiness: number,
): number {
  const weightedScore = health * HEALTH_WEIGHT + happiness * HAPPINESS_WEIGHT;
  return Math.max(1, Math.floor(weightedScore / LEVEL_PER_POINT));
}

export function percentageUntilNextLevel(
  health: number,
  happiness: number,
): number {
  const currentLevel = calculateLevel(health, happiness);
  const nextLevel = currentLevel + 1;
  const nextLevelThreshold = nextLevel * LEVEL_PER_POINT;
  const currentScore = health * HEALTH_WEIGHT + happiness * HAPPINESS_WEIGHT;
  const pointsUntilNextLevel = nextLevelThreshold - currentScore;

  // Calculate the percentage of progress towards the next level
  const totalPointsForCurrentLevel = LEVEL_PER_POINT;
  const percentage =
    ((totalPointsForCurrentLevel - pointsUntilNextLevel) /
      totalPointsForCurrentLevel) *
    100;

  return Math.max(0, Math.min(100, percentage)); // Ensure the percentage is between 0 and 100
}
