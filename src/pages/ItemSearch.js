import React, {useState, useEffect, useContext} from "react";
import {DateRange} from "react-date-range";
import {format} from 'date-fns';
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import {addDays} from "date-fns";
import {server, DEV_CATERING_TIME, ORDER_STATUS} from "../constants";
import "./../assets/itemSearch.scss";
import {saveAs} from "file-saver";
import SearchFields from "../components/SearchFields.js";
import {ProductsDataContext} from "../App";

const searchFields = [
    {name: "orderID", label: "Order ID", type: "text"},
    {name: "name", label: "Name", type: "text"},
    {name: "mobile", label: "Mobile", type: "text"},
    {name: "email", label: "Email", type: "text"},
    {name: "cateringDate", label: "Catering Date", type: "date"},
    {
        name: "cateringTime",
        label: "Catering Time",
        type: "select",
        options: DEV_CATERING_TIME,
    },
    {
        name: "orderStatus",
        label: "Order Status",
        type: "select",
        options: ORDER_STATUS,
    },
];

const ItemSearch = () => {
    const {productsJSON} = useContext(ProductsDataContext);
    const [results, setResults] = useState([]);
    const [orders, setOrders] = useState([]);
    const [data, setData] = useState([]);
    const [search, setSearch] = useState("");
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
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const handleOrderSelect = (event, orderID) => {
        const products = results.filter((product) => product.orderID === orderID);
        if (event.target.checked) {
            setSelectedOrders((prevSelectedOrders) => [
                ...prevSelectedOrders,
                orderID,
            ]);
            products.forEach(({id}) => {
                setSelectedProducts((prevSelectedProducts) => [
                    ...prevSelectedProducts,
                    id,
                ]);
            });
        } else {
            setSelectedOrders((prevSelectedOrders) =>
                prevSelectedOrders.filter((id) => id !== orderID)
            );
            products.forEach(({id}) => {
                setSelectedProducts((prevSelectedProducts) =>
                    prevSelectedProducts.filter((pid) => pid !== id)
                );
            });
        }

        console.log(selectedOrders);
    };

    const handleProductSelect = (event, productId) => {
        if (event.target.checked) {
            setSelectedProducts((prevSelectedProducts) => [
                ...prevSelectedProducts,
                productId,
            ]);
        } else {
            setSelectedProducts((prevSelectedProducts) =>
                prevSelectedProducts.filter((id) => id !== productId)
            );
        }
    };

    const handleCustomSearch = (newSearch) => {
        setCustomSearch(newSearch);
    };

    useEffect(() => {
        filteredResults();
    }, [results,customSearch, search]);

    function filteredResults() {
        const filteredOrders = orders.filter((order) => {
            const {
                orderID,
                name,
                mobile,
                email,
                cateringDate,
                cateringTime,
                orderDate,
                orderStatus,
            } = customSearch;

            if (orderID && !order.orderID.toString().includes(orderID)) {
                return false;
            }
            // Check if name matches
            if (name && !order.name.toLowerCase().includes(name.toLowerCase())) {
                return false;
            }
            // Check if mobile matches
            if (mobile && !order.mobile.includes(mobile)) {
                return false;
            }
            // Check if email matches
            if (email && !order.email.toLowerCase().includes(email.toLowerCase())) {
                return false;
            }
            // Check if cateringDate matches
            console.log(cateringDate);
            if (cateringDate && !order.cateringDate.includes(cateringDate)) {
                return false;
            }
            // Check if cateringTime matches
            if (cateringTime && !order.cateringTime.includes(cateringTime)) {
                return false;
            }
            // Check if orderDate matches
            if (orderDate && !order.orderDate.includes(orderDate)) {
                return false;
            }
            // Check if orderStatus matches
            if (orderStatus && !order.orderStatus.includes(orderStatus)) {
                return false;
            }
            console.log("order ", order);
            // If all checks pass, return true to include the order in the filtered list
            return true;
        });

        const filteredProducts = results.filter((product) => {
            return filteredOrders.find((order) => order.orderID === product.orderID);
        });

        const searchResults = filteredProducts.filter((item) =>
            item.productName.toLowerCase().includes(search)
        );

        setData(searchResults);
    }

    function getOrderFromProduct(productID) {
        const order = orders.find((order) => order.orderID === productID);
        return order;
    }

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function reloadPage() {
        window.location.reload();
    }

    const [date, setDate] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("jwt");
            const response = await fetch(`${server}/user/searchItems`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${token}`,
                },
                body: JSON.stringify({
                    date: date[0],
                }),
            });
            const data = await response.json();
            let {products, customProducts} = data;
            let mappedData = products.map((productData) => {
                const originalProduct = productsJSON.find(
                    (product) => product.productID === productData.productID
                );
                return {
                    ...productData,
                    productName: originalProduct.productName.toLowerCase(),
                };
            });

            setOrders(data.orders);
            console.log(data.orders, mappedData, customProducts);
            customProducts = customProducts.map(product => {
                product.id = -Math.abs(product.id);
                return product;
            });
            mappedData = mappedData.concat(customProducts);
            console.log(mappedData, customProducts);
            setResults(mappedData);
            const searchResults = mappedData.filter((item) =>
                item.productName.toLowerCase().includes(search)
            );
            setData(searchResults);
        } catch (error) {
            console.error(error.message);
        }
    };
    useEffect(() => {
        fetchOrders();
    }, [date]);

    function handleSearch(event) {
        const term = event.target.value.toLowerCase();
        setSearch(term);
    }

    const downloadCsv = (data) => {
        console.log(data)
        const init =
            "Order ID, Product Name, Quantity, Size, Order Status, Catering Date, Catering Time";
        const csv = data
            .map((product) => {
                const {id, orderID, productName, quantity, size} = product;
                const {orderStatus, cateringDate, cateringTime, pickupTime} =
                    getOrderFromProduct(orderID);
                return `${orderID}, ${capitalizeFirstLetter(
                    productName
                )},${quantity},${size},${orderStatus}, ${cateringDate}, ${cateringTime}, ${formatTime(cateringDate, pickupTime)}`;
            })
            .join("\n");
        const combinedCsv = init + "\n" + csv; // add init to the beginning of the CSV data
        const combinedBlob = new Blob([combinedCsv], {type: "text/csv"});
        saveAs(combinedBlob);
        downloadCsv2(data)
    };

    const downloadCsv2 = (data) => {
        const mergedProducts = {};

        data.forEach((product) => {
            const {orderID, productName, quantity, size} = product;
            const {orderStatus, cateringDate, cateringTime, pickupTime} =
                getOrderFromProduct(orderID);

            const key = productName.toLowerCase(); // Use lowercase product name as the key
            if (mergedProducts[key]) {
                if (!mergedProducts[key].quantity[size]) {
                    mergedProducts[key].quantity[size] = 0;
                }
                mergedProducts[key].quantity[size] += quantity;
                mergedProducts[key].other += ` | ${quantity}-${size}`;
            } else {
                mergedProducts[key] = {
                    orderID,
                    productName: capitalizeFirstLetter(productName),
                    quantity: {
                        [size]: quantity
                    },
                    other: `${quantity}-${size}`
                };
            }
        });

        const mergedProductsArray = Object.values(mergedProducts);

        const init =
            "Product Name, Quantity, Other";
        const csv = mergedProductsArray
            .map((product) => {
                const {
                    productName,
                    quantity,
                    other
                } = product;
                let new_quantity = Object.entries(quantity)
                    .map(([key, value]) => {
                        return `${value} ${key}`;
                    })
                    .join('| ');
                return `${productName},${new_quantity},${other}`;
            })
            .join("\n");

        const combinedCsv = init + "\n" + csv; // add init to the beginning of the CSV data
        const combinedBlob = new Blob([combinedCsv], {type: "text/csv"});
        saveAs(combinedBlob);
    };

    function formatTime(cateringDate, pickupTime) {
        if (!cateringDate || !pickupTime) {
            return '';
        }
        const formattedTime = format(new Date(`${cateringDate}T${pickupTime}`), 'h:mm a');
        return formattedTime;
    }

    function getRowClassName(orderStatus) {
        switch (orderStatus) {
            case ORDER_STATUS[1]:
                return "yellow-row";
            case ORDER_STATUS[2]:
                return "blue-row";
            case ORDER_STATUS[3]:
                return "green-row";
            case ORDER_STATUS[4]:
                return "purple-row";
            default:
                return "";
        }
    }

    function getSelectedProducts() {
        const selectedProductsList = results.filter((product) =>
            selectedProducts.includes(product.id)
        );
        return selectedProductsList;
    }

    function createShortForm(str) {
        if (!str) {
            return "";
        }
        // Match the first letter of each word and any optional whitespace after it
        const regex = /(\w)\w*\s*/g;
        // Replace each match with the first letter and a dot
        const shortForm = str.replace(regex, "$1.");
        // Return the resulting string in uppercase
        return shortForm.toUpperCase();
    }

    return (
        <>
            <div className="itemSearchPage">
                <div className="item__filters">
                    <DateRange
                        editableDateInputs={true}
                        onChange={(item) => setDate([item.selection])}
                        moveRangeOnFirstSelection={false}
                        ranges={date}
                    />
                    <div className="item__search__options">
                        <SearchFields
                            searchFields={searchFields}
                            customSearch={customSearch}
                            handleCustomSearch={handleCustomSearch}
                        />
                        <br/>
                        <ul className="grid">
                            <li>
                                <span className="status-box yellow-row"></span>
                                <span>Pending</span>
                            </li>
                            <li>
                                <span class="status-box blue-row"></span>
                                <span>Quoted</span>
                            </li>
                            <li>
                                <span class="status-box green-row"></span>
                                <span>Confirmed</span>
                            </li>
                            <li>
                                <span class="status-box purple-row"></span>
                                <span>Completed</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="options">
                    <div className="item-search">
                        <label for="search">Search:</label>
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            id="search"
                            name="search"
                            placeholder="Enter your search terms"
                        />
                        <i
                            className="las la-file-download"
                            onClick={() => downloadCsv(data)}
                        />
                        <i className="las la-sync" onClick={() => reloadPage()}/>
                    </div>

                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Catering Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map((product) => {
                                const {id, orderID, productName, quantity, size} = product;
                                const {orderStatus, cateringDate, cateringTime, pickupTime} =
                                    getOrderFromProduct(orderID);
                                return (
                                    <tr key={id} className={getRowClassName(orderStatus)}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(orderID)}
                                                onChange={(e) => handleOrderSelect(e, orderID)}
                                            />

                                            {orderID}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(id)}
                                                onChange={(e) => handleProductSelect(e, id)}
                                            />
                                            {capitalizeFirstLetter(productName)}
                                        </td>
                                        <td>
                                            {quantity} {createShortForm(size)}
                                        </td>
                                        <td>
                                            {cateringTime}, {cateringDate}, {formatTime(cateringDate, pickupTime)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="options">
                    <div className="item-search">
                        <i
                            className="las la-file-download"
                            onClick={() => downloadCsv(getSelectedProducts())}
                        />
                    </div>

                    <div>
                        <table>
                            <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Catering Date</th>
                            </tr>
                            </thead>
                            <tbody>
                            {getSelectedProducts().map((product) => {
                                const {id, orderID, productName, quantity, size} = product;
                                const {orderStatus, cateringDate, cateringTime, pickupTime} =
                                    getOrderFromProduct(orderID);
                                return (
                                    <tr key={id} className={getRowClassName(orderStatus)}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedOrders.includes(orderID)}
                                                onChange={(e) => handleOrderSelect(e, orderID)}
                                            />

                                            {orderID}
                                        </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(id)}
                                                onChange={(e) => handleProductSelect(e, id)}
                                            />
                                            {capitalizeFirstLetter(productName)}
                                        </td>
                                        <td>
                                            {quantity} {createShortForm(size)}
                                        </td>
                                        <td>
                                            {cateringTime}, {cateringDate}, {formatTime(cateringDate, pickupTime)}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ItemSearch;
