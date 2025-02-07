
interface RecommendationInterface {
    id?: string;
    image?: string;
    name?: string;
    rating?: number;
    location?: string;
    price?: string;
}
interface RecommendationCardProps{
    recommendation: RecommendationInterface
}

const RecommendationCard = ({recommendation}: RecommendationCardProps) => {
    return (
        <div className="recommendation-card">
            <img src={recommendation.image} alt={recommendation.name} />
            <h3>{recommendation.name}</h3>
            <p>{recommendation.location}</p>
            <p className="rating">⭐ {recommendation.rating}</p>
            <p className="price">{recommendation.pri