import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BiDownload } from "react-icons/bi";
import DOMPurify from "dompurify";
import BackButton from "~/components/Global/BackButton/BackButton";
import Button from "~/components/Global/Button/Button";
import { useGetResourceBySlugQuery } from "~/redux/api/resources/resourcesApi";
import formatDate from "~/utilities/fomartDate";
import { API_BASE_URL } from "~/utilities/apiBaseUrl";

const selectToken = (state) => state.token?.accessToken;

const formatFileSize = (bytes) => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

const getFileExtension = (url) => {
  if (!url) return "";
  const parts = url.split(".");
  const ext = parts[parts.length - 1]?.split("?")[0]?.split("#")[0];
  return ext?.toUpperCase() || "";
};

const SingleResource = () => {
  const { slug } = useParams();
  const accessToken = useSelector(selectToken);
  const { data: singleRes } = useGetResourceBySlugQuery(slug, { skip: !slug });

  const handleDownload = async () => {
    if (!singleRes?.fileUrl) return;
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${slug}/download`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) throw new Error(`Download failed: ${response.status}`);

      const downloadInfo = await response.json();
      const fileUrl = downloadInfo?.data?.fileUrl;
      if (!fileUrl) throw new Error("The resource does not have a downloadable file.");
      const fileResponse = await fetch(fileUrl);
      if (!fileResponse.ok) throw new Error(`File download failed: ${fileResponse.status}`);
      const blob = await fileResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = singleRes.fileName || singleRes.title || "resource";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(singleRes.fileUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div>
      <BackButton label="Back to Resources" to="/dashboard/resources" />

      <section className="bg-white rounded-2xl p-6 shadow mt-8">
        <span className="capitalize bg-onTertiary text-tertiary px-4 py-2 rounded-lg text-xs font-semibold mb-4 inline-block">
          {singleRes?.category}
        </span>

        {["Article", "Newsletter"].includes(singleRes?.category) && singleRes?.featuredImage && (
          <img
            src={singleRes.featuredImage}
            alt={singleRes.title || "Resource"}
            className="w-full max-h-[400px] object-cover mb-4"
          />
        )}
        <h2 className="font-bold mb-3 text-lg">{singleRes?.title}</h2>
        <p
          id="resource-body"
          className="text-gray-dark mb-6"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(singleRes?.description || "") }}
        />

        {["Webinar", "Others"].includes(singleRes?.category) && (
          <div className="relative pb-[56.25%] h-0 overflow-hidden mb-8">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${slug}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded youtube"
            />
          </div>
        )}

        {/* Download Button */}
        {singleRes?.fileUrl && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="size-10 bg-primary/10 rounded-lg flex-shrink-0 inline-flex items-center justify-center text-primary">
                <BiDownload className="text-lg" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{singleRes.fileName || singleRes.title}</p>
                <p className="text-xs text-gray-500">
                  {getFileExtension(singleRes.fileUrl)}
                  {singleRes.fileSize && ` • ${formatFileSize(singleRes.fileSize)}`}
                </p>
              </div>
            </div>
            <Button label="Download" small icon={<BiDownload />} onClick={handleDownload} />
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          {singleRes?.tags?.map((tag) => (
            <span key={tag} className="capitalize bg-gray-light px-4 py-2 rounded text-xs font-medium">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray text-sm mb-4">
          Posted: <span className="text-black font-medium">{formatDate(singleRes?.createdAt).dateTime}</span>{" "}
        </p>
        <div className="inline-flex items-center gap-4">
          {singleRes?.author?.avatarUrl ? (
            <img
              src={singleRes.author.avatarUrl}
              alt={singleRes.author.name || "Resource author"}
              className="size-10 rounded-full bg-onPrimary"
            />
          ) : null}
          <p className="text-base font-semibold">{singleRes?.author?.name}</p>
        </div>
      </section>
    </div>
  );
};

export default SingleResource;
