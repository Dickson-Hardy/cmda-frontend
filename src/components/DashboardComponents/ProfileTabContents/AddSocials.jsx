import { useState } from "react";

const AddSocials = ({ onSave }) => {
  const [name, setName] = useState("");
  const [link, setLink] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    onSave(name, link);
    setName("");
    setLink("");
  };

  return (
    <form onSubmit={handleSave} className="flex items-center gap-3 w-full my-3">
      <select
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="bg-white border-gray placeholder:text-gray placeholder:text-xs border rounded-lg block w-full text-sm p-3 h-12 cursor-pointer focus:ring focus:ring-primary/20 focus:outline-none focus:bg-white focus:border-transparent transition-all flex-1"
      >
        <option value="">Select social platform</option>
        <option value="facebook">Facebook</option>
        <option value="twitter">Twitter</option>
        <option value="instagram">Instagram</option>
        <option value="linkedIn">LinkedIn</option>
      </select>
      <input
        type="text"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="Enter link"
        className="bg-white flex-[2] border border-gray placeholder:text-gray placeholder:text-xs rounded-md block w-full text-sm p-3 h-12 focus:ring focus:ring-primary/20 focus:outline-none focus:bg-white focus:border-transparent transition-all"
      />
      <button className="text-primary font-semibold cursor-pointer text-sm">Confirm</button>
    </form>
  );
};

export default AddSocials;
