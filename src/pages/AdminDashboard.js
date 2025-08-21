import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { server } from "../constants";
import "./../assets/adminDashboard.scss";

const AdminDashboard = () => {
    const [orderCounts, setOrderCounts] = useState({
        pending: 0,
        quoted: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
    });
    const navigate = useNavigate();
    const handleLogout = (e) => {
        localStorage.removeItem("jwt");
        navigate("/login");
    };

    useEffect(() => {
        async function fetchOrderCounts() {
            try {
                const token = localStorage.getItem("jwt");
                const response = await fetch(`${server}/orders/count`, {
                    method: "GET",
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                const data = await response.json();
                setOrderCounts(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchOrderCounts();
    }, []);

    return (
        <div>
            <div class="searches__box">
                <Link to="/admin/orders/search" className="search__box">
                    <i class="las la-search"></i>
                    <span>Search</span>
                </Link>
                <Link to="/admin/orders/itemsearch" className="search__box">
                    <i class="las la-search-plus"></i>
                    <span>Item Search</span>
                </Link>
                <Link to="/admin/menueditor" className="search__box">
                    <i class="la la-pencil"></i>
                    <span>Menu Editor</span>
                </Link>
           </div>
            <div className="orders__box">
                <div className="order__box">
                    <Link to="/admin/orders/notconfirmed" className="link-item">
                        <div className="icon">
                            <div className="sub-icon">
                                <i class="las la-question-circle lightslategrey"></i>{" "}
                            </div>
                        </div>
                        <div className="count-description">
                            <div className="count">{orderCounts.pending}</div>
                            <div className="description">
                                Unconfirmed Orders
                            </div>
                        </div>
                    </Link>
                </div>
                <div className="order__box">
                    <Link to="/admin/orders/quoted" className="link-item">
                        <div className="icon">
                            <div className="sub-icon">
                                <i class="las la-exclamation-circle goldenrod"></i>{" "}
                            </div>
                        </div>
                        <div className="count-description">
                            <div className="count">{orderCounts.quoted}</div>
                            <div className="description">Quoted Orders</div>
                        </div>
                    </Link>
                </div>
                <div className="order__box">
                    <Link to="/admin/orders/confirmed" className="link-item">
                        <div className="icon">
                            <div className="sub-icon">
                                <i class="las la-check-circle yellowgreen"></i>{" "}
                            </div>
                        </div>
                        <div className="count-description">
                            <div className="count">Unknown</div>
                            <div className="description">Confirmed Orders</div>
                        </div>
                    </Link>
                </div>
                <div className="order__box">
                    <Link to="/admin/orders/completed" className="link-item">
                        <div className="icon">
                            <div className="sub-icon">
                                <i class="las la-check-square lightseagreen"></i>{" "}
                            </div>
                        </div>
                        <div className="count-description">
                            <div className="count">Unknown</div>
                            <div className="description">Completed Orders</div>
                        </div>
                    </Link>
                </div>
                <div className="order__box">
                    <Link to="/admin/orders/cancelled" className="link-item">
                        <div className="icon">
                            <div className="sub-icon">
                                <i class="las la-times-circle brown"></i>{" "}
                            </div>
                        </div>
                        <div className="count-description">
                            <div className="count">Unknown</div>
                            <div className="description">Cancelled Orders</div>
                        </div>
                    </Link>
                </div>
            </div>
            <br />
            <br />

            <br />
            <br />
            <br />
            <div className="logout" onClick={handleLogout}>
                <i class="las la-sign-out-alt"></i> Logout
            </div>
        </div>
    );
};

export default AdminDashboard;
