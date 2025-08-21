import React, {useState, useEffect, useContext} from "react";
import { server, DEV_CATERING_TIME, ORDER_STATUS } from "../constants";
import "../assets/orderTable.scss";
import { useParams, Link } from "react-router-dom";
import SearchFields from "../components/SearchFields.js";
import { saveAs } from "file-saver";
import "./../assets/orderTableSearch.scss";
import Pagination from "./../components/Pagination.js";
import {ProductsDataContext} from "../App";

const searchFields = [
    { name: "orderID", label: "Order ID", type: "text" },
    { name: "name", label: "Name", type: "text" },
    { name: "mobile", label: "Mobile", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "cateringDate", label: "Catering Date", type: "date" },
    {
        name: "cateringTime",
        label: "Catering Time",
        type: "select",
        options: DEV_CATERING_TIME,
    },
    { name: "orderDate", label: "Order Date", type: "date" },
    {
        name: "orderStatus",
        label: "Order Status",
        type: "select",
        options: ORDER_STATUS,
    },
];

const OrderTable = (props) => {
    const { productsJSON } = useContext(ProductsDataContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const { orderStatus } = useParams();
    const [exactMatch, setExactMatch] = useState(false);
    const [customSearch, setCustomSearch] = useState({
        orderID: "",
        name: "",
        mobile: "",
        email: "",
        cateringDate: "",
        cateringTime: "",
        orderDate: "",
        orderStatus: "",
    });

    const handleCustomSearch = (newSearch) => {
        setCustomSearch(newSearch);
    };

    const handleExactMatchChange = () => {
        setExactMatch(!exactMatch);
    };

    const convertTimeToReadable = (date, include = "date") => {
        let dateJS = new Date(date);
        let offset = dateJS.getTimezoneOffset();
        dateJS = new Date(dateJS.getTime() + offset * 60 * 1000);
        let options = {};
        if (include === "date") {
            options = { month: "long", day: "numeric" };
        } else if (include === "datetime") {
            options = {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
            };
        }
        const readableDate = dateJS.toLocaleDateString("en-US", options);
        return readableDate;
    };

    async function deleteOrder(orderId) {
        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch(`${server}/orders/${orderId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (response.ok) {
                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order.orderID !== orderId)
                );
            } else {
                console.error("Failed to delete order");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const query = Object.keys(customSearch)
                .filter((key) => customSearch[key])
                .map((key) => {
                    if (exactMatch) {
                        return `${key}=${encodeURIComponent(
                            customSearch[key]
                        )}`;
                    } else {
                        return `${key}=${encodeURIComponent(
                            "%" + customSearch[key] + "%"
                        )}`;
                    }
                })
                .join("&");
            const response = await fetch(
                `${server}/user/searchOrders?page=${page}&pageSize=${pageSize}&${query}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            const data = await response.json();
            setOrders(data.orders);
            setCount(data.count);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [customSearch, orderStatus, page, pageSize]);

    const handlePageChange = (direction) => {
        if (direction === "next") {
            setPage(page + 1);
        } else {
            setPage(page - 1);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    const totalPages = Math.ceil(count / pageSize);
    const handleDownload = async (cateringDate) => {
        const getProductName = (productID) => {
            const product = productsJSON.find(
                (product) => product.productID === productID
            );
            return product ? product.productName : null;
        };
        const getTotal = (cart, customCart) => {
            const total = cart.reduce((acc, item) => {
                const product = productsJSON.find(
                    (p) => p.productID === item.productID
                );
                return acc + product.priceList[item.size] * item.quantity;
            }, 0);

            const customCarttotal = customCart.reduce((acc, item) => {
                return acc + parseInt(item.price, 10);
            }, 0);

            return total + customCarttotal;
        };
        try {
            const response = await fetch(
                `${server}/ordersByDate?cateringDate=${cateringDate}`
            );
            const orders = await response.json();

            const highestOrder = orders.reduce(
                (highest, order) => {
                    const totalOrderDetails =
                        order.orderDetails.length +
                        order.customOrderDetails.length;
                    if (highest.totalOrderDetails < totalOrderDetails) {
                        return { order, totalOrderDetails };
                    }
                    return highest;
                },
                { order: {}, totalOrderDetails: 0 }
            );

            let orderData = {
                Breakfast: [],
                Lunch: [],
                Dinner: [],
            };
            orders.forEach((orderInfo) => {
                const orderTemplate = {
                    DateTime: [],
                    OrderNo: [],
                    TotalCount: [],
                    Name: [],
                    PhoneNo: [],
                    Address: [],
                    WarmersAndBurners: [],
                    OrderStatus: [],
                    ItemsList: ["S.No", "Item Name", "Quantity", "Amount", ""],
                };

                const wrap = (value) => {
                    if (value === null) return " ";
                    return `"${value}"`;
                };

                console.log(orderInfo);
                const { order } = orderInfo;
                orderTemplate.DateTime = [
                    "Date & Time",
                    wrap(convertTimeToReadable(order.cateringDate)),
                    wrap(order.cateringTime),
                    "",
                    "",
                ];
                orderTemplate.OrderNo = [
                    "Order No",
                    wrap(order.orderID),
                    "",
                    "",
                    "",
                ];
                orderTemplate.TotalCount = [
                    "Total Count",
                    wrap(`${order.adultCount}A ${order.kidsCount}K`),
                    "",
                    "",
                    "",
                ];
                orderTemplate.Name = ["Name", wrap(order.name), "", "", ""];
                orderTemplate.PhoneNo = [
                    "Phone No",
                    wrap(order.mobile),
                    "",
                    "",
                    "",
                ];
                orderTemplate.Address = [
                    "Address",
                    wrap(order.address),
                    "",
                    "",
                    "",
                ];
                orderTemplate.WarmersAndBurners = [
                    "Warmers And Burners",
                    wrap(order.warmersAndBurners),
                    "",
                    "",
                    "",
                ];
                orderTemplate.OrderStatus = [
                    "Order Status",
                    wrap(order.orderStatus),
                    "",
                    "",
                    "",
                ];

                let i = 0;
                orderInfo.orderDetails.forEach((detail) => {
                    orderTemplate["Item_" + i] = [
                        i,
                        wrap(getProductName(detail.productID)),
                        wrap(`${detail.quantity} ${detail.size}`),
                        wrap(detail.price),
                        "",
                    ];
                    i++;
                });
                orderInfo.customOrderDetails.forEach((detail) => {
                    orderTemplate["Item_" + i] = [
                        i,
                        wrap(detail.productName),
                        wrap(`${detail.quantity} ${detail.size}`),
                        wrap(detail.price),
                        "",
                    ];
                    i++;
                });

                orderTemplate["Item_" + i] = ["", "", "", "", ""];
                i++;
                //orderTemplate["Item_" + i] = ["", "", "Total Price", wrap(getTotal(orderInfo.orderDetails, orderInfo.customOrderDetails)), ""];
                orderTemplate["Item_" + i] = [
                    "",
                    "",
                    "Total Price",
                    orderInfo.order.totalPrice,
                    "",
                ];
                i++;

                while (i <= highestOrder.totalOrderDetails + 6) {
                    orderTemplate["Item_" + i] = ["", "", "", "", ""];
                    i++;
                }
                switch (order.cateringTime) {
                    case "Breakfast": {
                        orderData.Breakfast.push(orderTemplate);
                        break;
                    }
                    case "Lunch": {
                        orderData.Lunch.push(orderTemplate);
                        break;
                    }
                    case "Dinner": {
                        orderData.Dinner.push(orderTemplate);
                        break;
                    }
                }
            });

            const genCSV = (cateringTime) => {
                let combinedCSV = {};
                cateringTime.forEach((obj) => {
                    for (let key in obj) {
                        if (combinedCSV[key]) {
                            combinedCSV[key] = combinedCSV[key].concat(
                                obj[key]
                            );
                        } else {
                            combinedCSV[key] = obj[key];
                        }
                    }
                });
                let csv = "";
                for (const key in combinedCSV) {
                    csv += combinedCSV[key].join(",") + "\n";
                }
                return csv;
            };

            const csvBlobs = [];
            for (const key in orderData) {
                csvBlobs.push(genCSV(orderData[key]));
            }
            const combinedBlob = new Blob([...csvBlobs], { type: "text/csv" });
            saveAs(combinedBlob);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="order__table__search">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
                    <div>
                        <div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={exactMatch}
                                    onChange={handleExactMatchChange}
                                />
                                Exact Matches
                            </label>
                        </div>
                        <SearchFields
                            searchFields={searchFields}
                            customSearch={customSearch}
                            handleCustomSearch={handleCustomSearch}
                        />
                        <DownloadableCSVCalender
                            handleDownload={handleDownload}
                            convertTimeToReadable={convertTimeToReadable}
                        />
                    </div>

                    <div className="table">
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            pageSize={pageSize}
                            handlePageChange={handlePageChange}
                            handlePageSizeChange={handlePageSizeChange}
                        />
                        <table>
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Name</th>
                                    <th>Order Mobile</th>
                                    <th>Order Email</th>
                                    <th>Created Date</th>
                                    <th>Catering Date</th>
                                    <th>Catering Time</th>
                                    <th>Order Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.orderID}>
                                        <td>
                                            {order.orderID} &nbsp;
                                            <i
                                                className="las la-minus-square"
                                                onClick={() => {
                                                    if (
                                                        window.confirm(
                                                            "Are you sure you want to delete this order?"
                                                        )
                                                    ) {
                                                        deleteOrder(
                                                            order.orderID
                                                        );
                                                    }
                                                }}
                                            />
                                        </td>
                                        <td>
                                            {props.view ? (
                                                <Link
                                                    to={`/admin/orderdetail/view/${order.orderID}`}
                                                >
                                                    {order.name}
                                                </Link>
                                            ) : (
                                                <Link
                                                    to={`/admin/orderdetail/${order.orderID}`}
                                                >
                                                    {order.name}
                                                </Link>
                                            )}
                                        </td>
                                        <td>{order.mobile}</td>
                                        <td>{order.email}</td>
                                        <td>
                                            {convertTimeToReadable(
                                                order.orderDate
                                            )}{" "}
                                        </td>
                                        <td>
                                            {convertTimeToReadable(
                                                order.cateringDate
                                            )}
                                            <i className="las la-copy" onClick={() => handleDownload( order.cateringDate)
                                                }
                                            />
                                            {/*<i className="las la-sticky-note"/>*/}
                                        </td>
                                        <td>{order.cateringTime}</td>
                                        <td>{order.orderStatus}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

const DownloadableCSVCalender = (props) => {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleDateClick = (e) => {
        const selectedDate = new Date(e.target.value);
        props.handleDownload(props.convertTimeToReadable(selectedDate));
    };

    return (
        <div>
            <label>Download By Date: &nbsp; </label>
            <input
                type="date"
                value={selectedDate}
                onChange={handleDateClick}
            />
        </div>
    );
};

export default OrderTable;
