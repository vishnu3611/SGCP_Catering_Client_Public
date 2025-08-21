import React, {useState, useEffect, useContext} from "react";
import { server } from "../constants";
import "../assets/orderTable.scss";
import { useParams, Link } from "react-router-dom";
import Pagination from "./../components/Pagination.js";
import { saveAs } from "file-saver";
import {ProductsDataContext} from "../App";

const OrderTable = () => {
    const { productsJSON } = useContext(ProductsDataContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [count, setCount] = useState(0);
    const { orderStatus } = useParams();

    const convertTimeToReadable = (date, include = "date") => {
        let dateJS = new Date(date);
        let offset = dateJS.getTimezoneOffset();
        dateJS = new Date(dateJS.getTime() + offset * 60 * 1000);
        let options = {};
        if (include === "date") {
            options = { year: "numeric", month: "long", day: "numeric" };
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
            setLoading(true);

            const token = localStorage.getItem("jwt");
            const response = await fetch(
                `${server}/user/orders/${orderStatus}?page=${page}&pageSize=${pageSize}`,
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                }
            );
            const data = await response.json();
            setOrders(data.orders);
            setCount(data.count);
            setLoading(false);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [orderStatus, page, pageSize]);

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

    function displayTime12(timeString) {
        if (!timeString || typeof timeString !== "string") {
                    return "-";
                
        }

            const time = timeString.split(":");
        if (time.length !== 3) {
                    return "Invalid time format";
                
        }

            let hour = parseInt(time[0]);
            const minute = time[1];
            let ampm = "AM";

        if (isNaN(hour) || hour < 0 || hour > 23) {
                    return "Invalid hour";
                
        }

        if (isNaN(parseInt(minute)) || minute < 0 || minute > 59) {
                    return "Invalid minute";
                
        }

        if (hour > 12) {
                    hour -= 12;
                    ampm = "PM";
                
        }

            return `${hour}:${minute} ${ampm}`;
        
    }

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
            let orders = await response.json();

            console.log(orders);
            orders = orders.filter(({ order }) => {
                console.log(order.orderStatus, orderStatus);
                if (
                    order.orderStatus === "pending" &&
                    orderStatus === "notconfirmed"
                ) {
                    console.log(order.orderStatus, orderStatus);
                    return true;
                }
                return order.orderStatus === orderStatus;
            });
            console.log(orders);

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
                    OrderID: [],
                    DateTime: [],
                    OrderNo: [],
                    TotalCount: [],
                    Name: [],
                    PhoneNo: [],
                    Address: [],
                    WarmersAndBurners: [],
                    OrderStatus: [],
                    Notes: [],
                    ItemsList: ["S.No", "Item Name", "Quantity", "Amount", ""],
                };

                const wrap = (value) => {
                    if (value === null) return " ";
                    return `"${value}"`;
                };

                const getDeliveryCharge = () => {
                    return order.deliveryCharge && order.deliveryCharge > 0 ? " + " + order.deliveryCharge: ""
               }

                console.log(orderInfo);
                const { order } = orderInfo;
                orderTemplate.OrderID= [
                    "Order ID",
                    order.orderID,
                    "",
                    "",
                    "",
                ];
 
                orderTemplate.DateTime = [
                    "DateTime",
                    wrap(convertTimeToReadable(order.cateringDate)),
                    wrap(order.cateringTime),
                    "",
                    "",
                ];
                orderTemplate.OrderNo = [
                    "Order No",
                    wrap(order.orderID),
                    wrap(displayTime12(order.pickupTime)),
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
                    order.deliveryCharge && order.deliveryCharge > 0 ? "Delivery Charge: " + order.deliveryCharge: "",
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
                orderTemplate.Notes = [
                    "Notes",
                    wrap(order.notes),
                    wrap(order.revisionNotes),
                    "",
                    "",
                ];

                let i = 0;

                orderInfo.orderDetails.forEach((detail) => {
                    let productName = getProductName(detail.productID);
                    let productNote = detail.productNote ? ` (${detail.productNote})` : "";
                    orderTemplate["Item_" + i] = [
                        i + 1,
                        wrap(productName + productNote),
                        wrap(`${detail.quantity} ${detail.size}`),
                        wrap(detail.price),
                        "",
                    ];
                    i++;
                });

                orderInfo.customOrderDetails.forEach((detail) => {
                    let productName = detail.productName;
                    let productNote = detail.productNote ? ` (${detail.productNote})` : "";
 
                    orderTemplate["Item_" + i] = [
                        i+1,
                        wrap(productName + productNote),
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
                    "Total Amount: " +  orderInfo.order.totalPrice + getDeliveryCharge(),
                    "Advanced Amount: "+ orderInfo.order.advAmount,
"Balance Amount: " + (orderInfo.order.totalPrice - orderInfo.order.advAmount),
                    "",
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
        <div className="order__table">
            {loading ? (
                <div>Loading...</div>
            ) : (
                <>
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
                                                    deleteOrder(order.orderID);
                                                }
                                            }}
                                        />{" "}
                                    </td>
                                    <td>
                                        {" "}
                                        <Link
                                            to={`/admin/orderdetail/${order.orderID}`}
                                        >
                                            {order.name}
                                        </Link>
                                    </td>
                                    <td>{order.mobile}</td>
                                    <td>
                                        {convertTimeToReadable(order.orderDate)}{" "}
                                    </td>

                                    <td>
                                        {convertTimeToReadable(
                                            order.cateringDate
                                        )}
                                        <i
                                            className="las la-copy"
                                            onClick={() =>
                                                handleDownload(
                                                    order.cateringDate
                                                )
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
                    <div>
                        <DownloadableCSVCalender
                            handleDownload={handleDownload}
                            convertTimeToReadable={convertTimeToReadable}
                        />
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
