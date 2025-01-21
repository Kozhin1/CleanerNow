import { Database } from '@/lib/database.types';

type Review = Database['public']['Tables']['reviews']['Row'] & {
  reviewer: {
    full_name: string;
  };
};

type ReviewsListProps = {
  reviews: Review[];
};

export default function ReviewsList({ reviews }: ReviewsListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 15.585l-6.327 3.323 1.209-7.037L.172 7.332l7.046-1.024L10 0l2.782 6.308 7.046 1.024-4.71 4.539 1.209 7.037L10 15.585z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {review.reviewer.full_name}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          {review.comment && (
            <p className="mt-2 text-gray-700">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
