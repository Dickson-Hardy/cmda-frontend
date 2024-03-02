import icons from "~/assets/js/icons";

const ContactListItem = ({ name = "Dr John Simeon (BMBS, BM, MBChB)" }) => {
  return (
    <div className="flex items-center gap-2 p-4 px-2">
      {/* <img src="" className="bg-onPrimary rounded-full h-14 w-14" /> */}
      <span className="h-12 w-12 flex-shrink-0 bg-onSecondary rounded-full inline-flex items-center justify-center text-3xl">
        {icons.person}
      </span>
      <div className="truncate">
        <h5 className="font-semibold text-sm truncate">{name}</h5>
        <p className="text-xs truncate">Oops something has gone wrong, try again later</p>
      </div>
    </div>
  );
};

export default ContactListItem;
