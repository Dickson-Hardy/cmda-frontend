import icons from "~/assets/js/icons";

const EmptyData = ({ title = "Data", subtitle }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center py-8 px-4 gap-1">
      <span className="bg-onPrimary rounded-full h-16 w-16 text-primary text-3xl flex items-center justify-center">
        {icons.file}
      </span>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">{subtitle || `No ${title.toLowerCase()} available to display`}</p>
    </div>
  );
};

export default EmptyData;
