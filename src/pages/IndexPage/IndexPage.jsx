import { Link, useNavigate } from "react-router-dom";
import { FAQS } from "~/constants/faqs";
import { FOOTER_LINKS, OFFICES } from "~/constants/footer";
import Button from "~/components/Global/Button/Button";
import Logo from "~/components/Global/Logo/Logo";
import doctorPng from "~/assets/images/cheerful-doctor.png";
import studentsPng from "~/assets/images/students.png";
import lecturerPng from "~/assets/images/lecturer.png";
import { classNames } from "~/utilities/classNames";

const IndexPage = () => {
  const navigate = useNavigate();

  const CATEGORIES = [
    {
      name: "Students Arm",
      more: "Providing support and resources for medical and dental students to foster their professional and spiritual growth.",
      colors: ["bg-primary/70", "bg-primary"],
      image: studentsPng,
    },
    {
      name: "Doctors Arm",
      more: "Facilitating a network for practicing medical and dental doctors to collaborate, share knowledge, and strengthen their faith.",
      colors: ["bg-secondary/70", "bg-secondary"],
      image: doctorPng,
    },
    {
      name: "Global Network Members Arm",
      more: "Connecting medical and dental professionals around the world to share experiences, resources, and promote global health initiatives.",
      colors: ["bg-tertiary/70", "bg-tertiary"],
      image: lecturerPng,
    },
  ];

  return (
    <div>
      <section className="bg-gray-200 py-10 lg:py-10 bg-center" style={{ backgroundImage: `url(${doctorPng})` }}>
        <div className="max-w-screen-xl mx-auto px-8 xl:px-0 flex items-center min-h-[500px]">
          <div className="p-8 lg:p-12 bg-white rounded-3xl w-full lg:w-1/2">
            <h3 className="font-bold text-3xl lg:text-4xl">Welcome to CMDA Nigeria</h3>
            <p className="my-6 lg:text-lg">
              Christian Medical and Dental Association of Nigeria seeks to establish a Christian witness through Medical
              and Dental doctors and students in every community in Nigeria and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={() => navigate("/signup")} large label="Join us Now" />
              <Button onClick={() => navigate("/login")} large variant="outlined" label="Login Now" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-10">
        <div className="max-w-screen-xl mx-auto px-8 xl:px-0 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {CATEGORIES.map((item, x) => (
            <div
              key={x}
              className={classNames(
                "h-64 group rounded-3xl relative bg-cover transition-all cursor-pointer text-onPrimary",
                x > 1 && "lg:col-span-2",
                "bg-center"
              )}
              style={{ backgroundImage: `url(${item.image})` }}
            >
              <div className={classNames("p-10 rounded-3xl h-full flex items-end", item.colors[0])}>
                <h4 className="text-xl font-semibold">{item.name}</h4>
              </div>
              <div
                className={classNames(
                  "absolute bottom-0 left-0 right-0 w-full flex flex-col justify-end",
                  item.colors[1],
                  "h-0 opacity-0 group-hover:h-full group-hover:opacity-100 rounded-3xl p-10 transition-all duration-500 ease-in-out"
                )}
              >
                <h4 className="text-base font-semibold mb-2">{item.name}</h4>
                <p className="text-sm">{item.more}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary py-10 lg:py-10">
        <div className="max-w-screen-xl mx-auto px-8 xl:px-0 flex flex-col lg:flex-row gap-10">
          <img className="bg-onPrimaryContainer rounded-3xl w-full lg:w-1/2 h-auto hidden lg:block" src={studentsPng} />
          <div className="p-8 lg:p-12 bg-onPrimary rounded-3xl w-full lg:w-1/2">
            <h3 className="font-bold text-2xl lg:text-3xl mb-4">Frequently Asked Questions</h3>
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {FAQS.map((faq, index) => (
                <details key={index} className="py-2">
                  <summary className="text-sm cursor-pointer font-medium">
                    <span className="ml-4" />
                    {faq.question}
                  </summary>
                  <p className="text-sm ml-8 mt-3 font-light">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="bg-black pt-14 text-onPrimary">
        <div className="max-w-screen-xl mx-auto px-8 xl:px-0">
          <section className="flex flex-col lg:flex-row gap-16">
            <div className="w-full lg:w-1/4">
              <Logo />
              <p className="text-sm mt-6">Design amazing digital experiences that create more happy in the world.</p>
            </div>
            <div className="w-full lg:w-3/4 grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-5">
              {Object.keys(FOOTER_LINKS).map((key) => (
                <div key={key}>
                  <h4 className="text-sm font-semibold capitalize mb-4">{key}</h4>
                  <ul className="space-y-3 list-none">
                    {FOOTER_LINKS[key].map((item) => (
                      <li key={item.name}>
                        <Link className="text-sm hover:underline p-1" to={item.href}>
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="col-span-2 lg:col-span-1">
                <h4 className="text-sm font-semibold capitalize mb-4">Visit Us</h4>
                <ul className="space-y-3 list-none">
                  {OFFICES.map((item) => (
                    <li key={item.name} className="text-sm">
                      <span className="font-semibold">{item.name}</span> -{" "}
                      <span className="font-light">{item.address}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
          <section className="text-center py-8 lg:py-12 mt-8">
            <p className="text-sm">&copy; {new Date().getFullYear()} CMDA Nigeria | All rights reserved.</p>
            <p className="text-xs mt-1">
              Built by{" "}
              <a
                href="https://www.danisoftsolution.com/en/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Danisoft Innovative Solution LTD
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
