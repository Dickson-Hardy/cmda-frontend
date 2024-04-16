import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import icons from "~/assets/js/icons";
import Button from "~/components/Global/Button/Button";
import Loading from "~/components/Global/Loading/Loading";
import { useGetSingleUserQuery } from "~/redux/api/user/userApi";
import { classNames } from "~/utilities/classNames";

const DashboardMemberDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: member, isLoading } = useGetSingleUserQuery(id, {
    refetchOnMountOrArgChange: true,
    skip: !id,
  });

  const memberInfo = useMemo(() => {
    return {
      "First Name": member?.firstName,
      "Middle Name": member?.middleName,
      "Last Name": member?.lastName,
      Gender: member?.gender,
      Membership: member?.role,
      Region: member?.region,
      About: member?.bio,
      "Email Address": member?.email,
      "Phone Number": member?.phone,
    };
  }, [member]);

  return (
    <div>
      <div className="flex justify-start items-center">
        <Link
          to="/members"
          className="inline-flex gap-2 text-base items-center font-medium text-primary hover:underline"
        >
          {icons.arrowLeft}
          Back to Members List
        </Link>
      </div>

      <div className="max-w-screen-md mx-auto shadow h-[calc(100vh-240px)] md:h-[calc(100vh-180px)] overflow-y-auto bg-white rounded-lg pb-5 mt-6">
        <div className="flex gap-3 justify-between items-center p-5 mb-5 bg-white rounded-t-lg sticky top-0 right-0 left-0">
          <h2 className="text-black truncate text-xl md:text-2xl font-bold">{member?.firstName}</h2>
          <Button
            color={member?.role === "student" ? "secondary" : member?.role === "doctor" ? "primary" : "tertiary"}
            onClick={() => navigate("/messaging?id=" + id)}
          >
            Message
          </Button>
        </div>

        {member?.profileImageUrl ? (
          <img className="size-40 md:size-52 bg-white p-1 rounded-full mx-auto" src={member?.profileImageUrl} alt="" />
        ) : (
          <div className="text-center">
            <span
              className={classNames(
                "inline-flex justify-center items-center text-8xl size-40 md:size-52 border bg-white p-1 rounded-full",
                member?.role === "student"
                  ? "bg-onSecondary text-secondary"
                  : member?.role === "doctor"
                    ? "bg-onPrimary text-primary"
                    : "bg-onTertiary text-tertiary"
              )}
            >
              {icons.person}
            </span>
          </div>
        )}

        {isLoading ? (
          <Loading height={48} width={48} className="text-primary mx-auto my-40" />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-col-2 md:grid-cols-3 gap-4 md:gap-8 mt-5 p-5 pb-0">
              {Object.entries(memberInfo).map(([key, value]) => (
                <div
                  key={key}
                  className={
                    key === "About" ? "col-span-2 md:col-span-3" : key === "Email Address" ? "col-span-2" : "col-span-1"
                  }
                >
                  <h5 className="font-bold uppercase mb-0.5 text-xs text-gray-dark">{key}</h5>
                  <p className={classNames("text-black text-sm md:text-base", !key.includes("Email") && "capitalize")}>
                    {value || "---"}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2 px-5 mt-4 md:mt-8">
              {member?.socials.map((item) => (
                <a
                  key={item.name}
                  href={item.link?.startsWith("http") ? item.link : "https://" + item.link}
                  className="bg-gray-light rounded-full text-lg h-9 w-9 inline-flex justify-center items-center hover:text-primary cursor-pointer"
                  target="_blank"
                  rel="noreferrer"
                >
                  {icons[item.name]}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardMemberDetailsPage;
