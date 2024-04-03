import icons from "~/assets/js/icons";

const ResourceCard = ({ title, subtitle, type = "article" /* audio, video */, image, width = 280 }) => {
  return (
    <div className="bg-white rounded-2xl border" style={{ width }}>
      <img src={image} className="bg-onPrimary h-32 w-full rounded-t-lg object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span>{type === "audio" ? icons.audio : type === "video" ? icons.play : icons.newspaper}</span>
          <h4 className="text-sm font-bold truncate">{title}</h4>
        </div>
        <p className="text-gray-dark text-xs mt-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: subtitle }} />
      </div>
    </div>
  );
};

export default ResourceCard;
