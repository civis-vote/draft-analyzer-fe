import { ScoreAnalysisResponse } from "@/model/ScoreAnalysisModels";

// Utility function to remove empty string or undefined fields
export const removeEmptyFields = (obj: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== '' && v !== undefined && v !== null)
  );
};

// Utility to group and sum scores by criteria
export const aggregateData = (items: ScoreAnalysisResponse[]) => {
  const map = new Map<
    string,
    { criteria: string; Score: number; Max: number }
  >();

  for (const item of items) {
    if (!map.has(item.criteria)) {
      map.set(item.criteria, {
        criteria: item.criteria,
        Score: item.prompt_score,
        Max: item.max_score,
      });
    } else {
      const existing = map.get(item.criteria)!;
      existing.Score += item.prompt_score;
      existing.Max += item.max_score;
    }
  }

  return Array.from(map.values());
};
