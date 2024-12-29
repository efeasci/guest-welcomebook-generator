import RecommendationCard from "./RecommendationCard";
import type { Recommendation } from "./types";

interface RecommendationListProps {
  recommendations: Recommendation[];
  onRemove: (id: string) => Promise<void>;
}

const RecommendationList = ({ recommendations, onRemove }: RecommendationListProps) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Selected Recommendations</h3>
      {recommendations.map((rec) => (
        <RecommendationCard
          key={rec.id}
          {...rec}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default RecommendationList;