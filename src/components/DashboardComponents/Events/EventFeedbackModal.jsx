import { useState } from "react";
import Modal from "~/components/Global/Modal/Modal";
import Button from "~/components/Global/Button/Button";
import Loading from "~/components/Global/Loading/Loading";
import { useSubmitEventFeedbackMutation, useGetEventFeedbackQuery } from "~/redux/api/commentsReactionsApi";
import { classNames } from "~/utilities/classNames";

const EventFeedbackModal = ({ eventId, isOpen, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useGetEventFeedbackQuery({ eventId, page: 1, limit: 10 }, { skip: !isOpen });
  const [submitFeedback, { isLoading: isSubmitting }] = useSubmitEventFeedbackMutation();

  const feedbackList = data?.items || [];
  const averageRating = data?.averageRating || 0;

  const handleSubmit = async () => {
    if (rating === 0) return;
    try {
      await submitFeedback({ eventId, rating, comment: comment.trim() || undefined }).unwrap();
      setRating(0);
      setComment("");
    } catch {
      // handled by RTK
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Event Feedback" maxWidth={520}>
      <div className="space-y-6">
        {/* Average Rating */}
        {feedbackList.length > 0 && (
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{averageRating.toFixed(1)}</p>
            <div className="flex justify-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={classNames(
                    "text-xl",
                    star <= Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
                  )}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{feedbackList.length} feedback{feedbackList.length !== 1 ? "s" : ""}</p>
          </div>
        )}

        {/* Rating Input */}
        <div>
          <p className="text-sm font-semibold mb-2">Your Rating</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-2xl transition-colors"
              >
                <span
                  className={classNames(
                    star <= (hoveredRating || rating) ? "text-yellow-400" : "text-gray-300"
                  )}
                >
                  &#9733;
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div>
          <p className="text-sm font-semibold mb-2">Comment (optional)</p>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this event..."
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <Button
          label="Submit Feedback"
          large
          className="w-full"
          loading={isSubmitting}
          disabled={rating === 0}
          onClick={handleSubmit}
        />

        {/* Existing Feedback */}
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loading className="text-primary w-6 h-6" />
          </div>
        ) : feedbackList.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            <p className="text-sm font-semibold">Recent Feedback</p>
            {feedbackList.map((fb, i) => (
              <div key={fb._id || i} className="border rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={classNames(
                          "text-sm",
                          star <= fb.rating ? "text-yellow-400" : "text-gray-300"
                        )}
                      >
                        &#9733;
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-gray-400">{fb.user?.fullName || "Anonymous"}</span>
                </div>
                {fb.comment && <p className="text-sm text-gray-600">{fb.comment}</p>}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default EventFeedbackModal;
