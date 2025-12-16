import { useState } from "react";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import { toast } from "react-toastify";

const VirtualMeetingCard = ({ meetingInfo, eventName }) => {
  const [showPasscode, setShowPasscode] = useState(false);

  if (!meetingInfo || !meetingInfo.meetingLink) return null;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const getPlatformIcon = (platform) => {
    const platformLower = platform?.toLowerCase() || "";
    if (platformLower.includes("zoom")) return "📹";
    if (platformLower.includes("google")) return "📞";
    if (platformLower.includes("teams")) return "💼";
    if (platformLower.includes("webex")) return "🎥";
    return "🔗";
  };

  const getJoinButtonColor = (platform) => {
    const platformLower = platform?.toLowerCase() || "";
    if (platformLower.includes("zoom")) return "bg-blue-600 hover:bg-blue-700";
    if (platformLower.includes("google")) return "bg-green-600 hover:bg-green-700";
    if (platformLower.includes("teams")) return "bg-purple-600 hover:bg-purple-700";
    return "bg-primary hover:bg-primary-dark";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 shadow-lg border border-blue-200">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{getPlatformIcon(meetingInfo.platform)}</span>
        <div>
          <h3 className="text-lg font-bold text-gray-800">Join Virtual Meeting</h3>
          {meetingInfo.platform && <p className="text-sm text-gray-600">via {meetingInfo.platform}</p>}
        </div>
      </div>

      {/* Quick Join Button */}
      <a
        href={meetingInfo.meetingLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`block w-full text-center text-white font-semibold py-3 px-4 rounded-lg transition-colors ${getJoinButtonColor(meetingInfo.platform)} mb-4`}
      >
        🚀 Join Meeting Now
      </a>

      {/* Meeting Details */}
      <div className="space-y-3 bg-white rounded-lg p-4">
        {meetingInfo.meetingId && (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">Meeting ID</p>
              <p className="text-sm font-mono font-semibold text-gray-800">{meetingInfo.meetingId}</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(meetingInfo.meetingId, "Meeting ID")}
              className="text-blue-600 hover:text-blue-700 p-2"
              title="Copy Meeting ID"
            >
              {icons.copy || "📋"}
            </button>
          </div>
        )}

        {meetingInfo.passcode && (
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 font-medium">Passcode</p>
              <div className="flex items-center gap-2">
                <p className="text-sm font-mono font-semibold text-gray-800">
                  {showPasscode ? meetingInfo.passcode : "••••••"}
                </p>
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {showPasscode ? "Hide" : "Show"}
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(meetingInfo.passcode, "Passcode")}
              className="text-blue-600 hover:text-blue-700 p-2"
              title="Copy Passcode"
            >
              {icons.copy || "📋"}
            </button>
          </div>
        )}

        {meetingInfo.meetingLink && (
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex-1 overflow-hidden">
              <p className="text-xs text-gray-500 font-medium">Meeting Link</p>
              <p className="text-xs text-blue-600 truncate">{meetingInfo.meetingLink}</p>
            </div>
            <button
              type="button"
              onClick={() => copyToClipboard(meetingInfo.meetingLink, "Meeting Link")}
              className="text-blue-600 hover:text-blue-700 p-2"
              title="Copy Link"
            >
              {icons.copy || "📋"}
            </button>
          </div>
        )}

        {meetingInfo.dialInNumbers && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 font-medium mb-1">Dial-In Numbers</p>
            <p className="text-sm text-gray-700">{meetingInfo.dialInNumbers}</p>
          </div>
        )}

        {meetingInfo.additionalInstructions && (
          <div className="pt-2 border-t">
            <p className="text-xs text-gray-500 font-medium mb-1">Instructions</p>
            <p className="text-sm text-gray-700">{meetingInfo.additionalInstructions}</p>
          </div>
        )}
      </div>

      {/* Calendar Add Button */}
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          className="flex-1 text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 py-2 px-3 rounded-lg transition-colors"
          onClick={() => toast.info("Add to calendar feature coming soon")}
        >
          📅 Add to Calendar
        </button>
        <button
          type="button"
          className="flex-1 text-sm text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 py-2 px-3 rounded-lg transition-colors"
          onClick={() => copyToClipboard(meetingInfo.meetingLink, "Meeting details")}
        >
          📤 Share Details
        </button>
      </div>
    </div>
  );
};

export default VirtualMeetingCard;
