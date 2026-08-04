import { useState } from "react";
import Modal from "~/components/Global/Modal/Modal";
import Button from "~/components/Global/Button/Button";
import { useCreatePersonalEventMutation } from "~/redux/api/personalEventsApi";
import { classNames } from "~/utilities/classNames";

const CATEGORIES = [
  { value: "birthday", label: "Birthday" },
  { value: "milestone", label: "Milestone" },
  { value: "reminder", label: "Reminder" },
  { value: "other", label: "Other" },
];

const COLOR_PRESETS = [
  { value: "#E74C3C", label: "Red" },
  { value: "#3498DB", label: "Blue" },
  { value: "#2ECC71", label: "Green" },
  { value: "#F39C12", label: "Orange" },
  { value: "#9B59B6", label: "Purple" },
  { value: "#1ABC9C", label: "Teal" },
];

const PersonalEventsModal = ({ isOpen, onClose, selectedDate }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(selectedDate || "");
  const [category, setCategory] = useState("reminder");
  const [color, setColor] = useState(COLOR_PRESETS[0].value);

  const [createPersonalEvent, { isLoading }] = useCreatePersonalEventMutation();

  const handleDateValue = () => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      return d.toISOString().split("T")[0];
    }
    return "";
  };

  const handleSubmit = async () => {
    if (!title.trim() || !date) return;
    try {
      await createPersonalEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        category,
        color,
      }).unwrap();
      setTitle("");
      setDescription("");
      setCategory("reminder");
      setColor(COLOR_PRESETS[0].value);
      onClose();
    } catch {
      // handled by RTK
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Personal Event" maxWidth={480}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Date *</label>
          <input
            type="date"
            value={date || handleDateValue()}
            onChange={(e) => setDate(e.target.value)}
            className="w-full h-10 px-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={classNames(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  category === cat.value
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Color</label>
          <div className="flex gap-2">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setColor(preset.value)}
                className={classNames(
                  "w-8 h-8 rounded-full border-2 transition-transform",
                  color === preset.value ? "border-gray-800 scale-110" : "border-transparent"
                )}
                style={{ backgroundColor: preset.value }}
                title={preset.label}
              />
            ))}
          </div>
        </div>

        <Button
          label="Create Event"
          large
          className="w-full"
          loading={isLoading}
          disabled={!title.trim() || !date}
          onClick={handleSubmit}
        />
      </div>
    </Modal>
  );
};

export default PersonalEventsModal;
