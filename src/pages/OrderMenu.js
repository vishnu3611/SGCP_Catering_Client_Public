import OrderList from "../components/OrderList";
import CustomerForm from "../components/CustomerForm";
import DatePicker from "react-datepicker";
import {useContext, useRef, useState} from "react";
import NotesForm from "../components/NotesForm";
import "../assets/global.scss";
import {server, whatsapp, email} from "../constants";
import {useNavigate} from "react-router-dom";
import logo from "./../assets/saigayatri.jpg";
import {ProductsDataContext} from './../App.js';

//Adding "Need Estimate" to all json elements

function OrderMenu() {
    const navigate = useNavigate();
    const {productsJSON} = useContext(ProductsDataContext);
    const [cart, setCart] = useState([]);
    const [categoryNotes, setCategoryNotes] = useState({});
    const [notes, setNotes] = useState("");
    const childRef = useRef();

    const products = productsJSON.filter(product => product.show != false).map((product) => {
        product.priceList["Need Estimate"] = 0;
        return product;
    });

    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const uniqueCategories = Array.from(
        new Set(products.map((item) => item.categoryName))
    );
    const createLists = uniqueCategories.map((category) => {
        const productsByCategory = products.filter(
            (product) => product.categoryName === category
        );
        return (
            <OrderList
                products={productsByCategory}
                category={category}
                cart={cart}
                setCart={setCart}
                categoryNotes={categoryNotes}
                setCategoryNotes={setCategoryNotes}
            />
        );
    });

    const submitOrder = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestCart = cart.map((product) => {
            const {productID, productName, quantity, size, price} = product;
            return {productID, productName, quantity, size, price};
        });

        if (!cart.length) {
            alert("You need to purchase atleast one item.");
            return;
        }
        const formData = childRef.current.returnFormData();
        if (formData === "Error") {
            //alert("Make sure your order details are correctly entered.");
            return;
        }

        formData.notes = notes;

        const requestBody = {
            formData,
            cart: requestCart,
            categoryNotes,
        };
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(requestBody),
        };

        fetch(server + "/api/createOrderWithProducts", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                const url = result.replace(/"/g, "");
                const parts = url.split("/");
                const desiredPart = "/" + parts.slice(3).join("/");
                navigate(desiredPart);
            })
            .catch((error) => console.log("error", error));
    };

    return (
        <>
            <div className="top">
                <div className="email">
                    <i class="fa-brands fa-whatsapp"></i>

                    <span><a href={"mailto:"+email} >
<i class="las la-envelope-open"></i>Email
                    </a></span>
                </div>
                <div className="whatsapp">
                    <i class="lab la-whatsapp"></i>
                    <span><a href={"tel:" + whatsapp}>{whatsapp}</a></span>
                </div>
            </div>
            <div className="main__header mobile">
                <img className="logo" src={logo} alt="Logo"/>
                <h3>Catering Form</h3>
            </div>

            <div className="main__header large">
                <img className="logo" src={logo} alt="Logo"/>
                <div className="h3-textbox">
                    <h3>Catering Form</h3>
                </div>
            </div>

            <CustomerForm ref={childRef}/>
            <div className="category__list">{createLists}</div>
            <NotesForm
                onChange={handleNotesChange}
                notes={notes}
                disabled={false}
            />

            <button className="order-btn" onClick={submitOrder}>
                Submit Order
            </button>
        </>
    );
}

export default OrderMenu;
