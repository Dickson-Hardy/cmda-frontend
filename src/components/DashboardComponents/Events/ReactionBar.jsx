import { useSelector } from "react-redux";
import { selectAuth } from "~/redux/features/auth/authSlice";
import { useToggleReactionMutation, useGetReactionsQuery } from "~/redux/api/commentsReactionsApi";
import { classNames } from "~/utilities/classNames";

const REACTION_TYPES = [
  { type: "like", emoji: "\ud83d\udc4d", label: "Like" },
  { type: "pray", emoji: "\ud83d\ude4f", label: "Pray" },
  { type: "amen", emoji: "\ud83d\ude4f", label: "Amen" },
  { type: "heart", emoji: "\u2764\ufe0f", label: "Heart" },
  { type: "hallelujah", emoji: "\ud83d\ude4c", label: "Hallelujah" },
];

const ReactionBar = ({ parentType, parentId }) => {
  const { user } = useSelector(selectAuth);
  const { data: reactionsData } = useGetReactionsQuery({ parentType, parentId });
  const [toggleReaction] = useToggleReactionMutation();

  const reactions = reactionsData?.reactions || [];
  const userReactions = reactionsData?.userReactions || [];

  const getReactionCount = (type) => {
    const found = reactions.find((r) => r.type === type);
    return found?.count || 0;
  };

  const isActive = (type) => userReactions.includes(type);

  const handleToggle = (type) => {
    toggleReaction({ parentType, parentId, type });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REACTION_TYPES.map(({ type, emoji, label }) => {
        const count = getReactionCount(type);
        const active = isActive(type);
        return (
          <button
            key={type}
            type="button"
            onClick={() => handleToggle(type)}
            className={classNames(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150",
              active
                ? "bg-primary/10 border-primary text-primary"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
            title={label}
          >
            <span className="text-sm">{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
};

export default ReactionBar;
