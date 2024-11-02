import { useMemo } from "react";
import { useParams } from "react-router-dom";
import BackButton from "~/components/Global/BackButton/BackButton";
import StatusChip from "~/components/Global/StatusChip/StatusChip";
import { useGetSingleOrderQuery } from "~/redux/api/products/productsApi";
import convertToCapitalizedWords from "~/utilities/convertToCapitalizedWords";
import formatDate from "~/utilities/fomartDate";
import { formatCurrency } from "~/utilities/formatCurrency";

const SingleOrder = () => {
  const { id } = useParams();
  const { data: order = {} } = useGetSingleOrderQuery(id, { skip: !id, refetchOnMountOrArgChange: true });

  const DETAILS = useMemo(
    () => ({
      status: <StatusChip status={order.status} />,
      paymentReference: order.paymentReference,
      orderedOn: formatDate(order.createdAt).dateTime,
      totalAmount: formatCurrency(order.totalAmount),
      shippingContactName: order.shippingContactName,
      shippingContactPhone: order.shippingContactPhone,
      shippingContactEmail: order.shippingContactEmail,
      shippingAddress: order.shippingAddress,
    }),
    [order]
  );

  return (
    <div>
      <BackButton label="Back to Orders History" to="/dashboard/store/orders" />

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <section className="bg-white-shadow rounded-xl w-full lg:w-1/2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(DETAILS).map(([key, value]) => (
              <div
                key={key}
                className={["shippingContactEmail", "shippingAddress"].includes(key) ? "col-span-2" : "col-span-1"}
              >
                <h5 className="text-gray-600 uppercase text-xs font-semibold mb-1">{convertToCapitalizedWords(key)}</h5>
                <p className="text-sm font-medium">{value || "N/A"}</p>
              </div>
            ))}
            <div className={"col-span-2"}>
              <h4 className="text-xs font-semibold text-gray-600 uppercase mb-1">Products</h4>
              <div className="py-1 px-1">
                <table className="table-auto text-sm w-full font-medium">
                  <tbody>
                    {order.products?.map((item, v) => (
                      <tr key={v}>
                        <td className="px-2 py-1">{item?.quantity}</td>
                        <td className="px-2 py-1">X</td>
                        <td className="px-1 py-1 font-medium flex items-center gap-1.5">
                          <img
                            src={item.product.featuredImageUrl}
                            className="size-8 rounded-lg bg-onPrimaryContainer"
                          />
                          <div>
                            <h5 className="truncate text-sm font-medium">{item?.product.name}</h5>
                            {item.size || item.color ? (
                              <p className="text-xs">
                                {item?.size ? "Size: " + item.size : ""} {item?.color ? "Color: " + item.color : ""}{" "}
                              </p>
                            ) : null}
                          </div>
                        </td>
                        <td className="px-2 py-1 font-medium">{formatCurrency(item.product.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white shadow rounded-xl w-full pt-6 lg:w-1/2">
          <div className="flex items-center justify-between gap-6 px-6 pb-6">
            <h3 className="font-bold text-base">Order Timeline</h3>
          </div>
          <div className="px-6 pb-6 text-sm pl-10">
            <ol className="relative border-l-4 border-gray-200">
              <li className="mb-10 ml-6">
                <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-primary rounded-full ring-8 ring-onPrimaryContainer" />
                <div className="flex items-center justify-between mb-1 pl-1">
                  <h3 className="text-sm uppercase font-semibold text-gray-900">Created</h3>
                  <span className="block text-sm font-normal leading-none text-gray-400">
                    {formatDate(order.createdAt).dateTime}
                  </span>
                </div>
                <p className="mb-4 font-normal text-gray-500 pl-1">Your order has been created successfully</p>
              </li>
              {order.orderTimeline?.map((event, index) => (
                <li key={index} className="mb-10 ml-6">
                  <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-primary rounded-full ring-8 ring-onPrimaryContainer" />
                  <div className="flex items-center justify-between mb-1 pl-1">
                    <h3 className="text-sm uppercase font-semibold text-gray-900">{event.status}</h3>
                    <span className="block text-sm font-normal leading-none text-gray-400">
                      {formatDate(event.date).dateTime}
                    </span>
                  </div>
                  <p className="mb-4 font-normal text-gray-500 pl-1">{event.comment}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SingleOrder;
