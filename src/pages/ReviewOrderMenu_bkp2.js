import * as React from 'react';
import {useContext, useEffect, useRef, useState} from 'react';
import NotesForm from "../components/NotesForm";
import OrderList from "../components/OrderList";
import CreateOverlay from "../components/CreateOverlay";
import {server} from "../constants";
import CustomerForm from "../components/CustomerForm";
import {useParams} from "react-router-dom";
import {ProductsDataContext} from "../App";



let initFormData = {};

function ReviewOrderMenu_bkp2() {
    const { productsJSON } = useContext(ProductsDataContext);
    const [cart, setCart] = useState([]);
    const [categoryNotes, setCategoryNotes] = useState({});
    const [notes, setNotes] = useState("");
    const [overlay, setOverlay] = useState(true);
    const childRef = useRef();
    const {orderID} = useParams();


    const products = productsJSON.map(product => {
        product.priceList["Need Estimate"] = 0;
        return product
    })
    const handleNotesChange = (event) => {
        setNotes(event.target.value);
    };

    const uniqueCategories = Array.from(new Set(products.map((item) => item.categoryName)));
    const createLists = uniqueCategories.map(category => {
        const productsByCategory = products.filter((product) => product.categoryName === category);
        return (
            <OrderList products={productsByCategory} category={category} cart={cart} setCart={setCart}
                       categoryNotes={categoryNotes} setCategoryNotes={setCategoryNotes}/>
        )
    })


    useEffect(() => {
        const token = localStorage.getItem('jwt');
        fetch(server + '/api/getOrderWithProductsAndNotes/' + orderID, {
            headers: {
                'Authorization': `${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                initFormData = data.order;
                setCategoryNotes(data.categoryNotes)
                setCart(data.cart)
                setNotes(data.notes)
            })
            .catch(error => console.error(error));
    }, []);

    const submitOrder = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const requestCart = cart.map((product) => {
            const {productID, productName, quantity, size, price} = product;
            return {productID, productName, quantity, size, price};
        });

        if (!cart.length) {
            alert("You need to purchase atleast one item.")
            return;
        }
        const formData = childRef.current.returnFormData();
        if (formData === "Error") {
            alert("Make sure your order details are correctly entered.")
            return;
        }

        formData.notes = notes;

        const requestBody = {
            formData,
            cart: requestCart,
            categoryNotes
        }
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody)
        };

        fetch(server + "/api/createOrderWithProducts", requestOptions)
            .then(response => response.text())
            .then(result => {
                // window.location.href = window.location.origin + '/' + result;
            })
            .catch(error => console.log('error', error));

    }

    return (
        <>
            {overlay &&
                <div className="info">Thank you for ordering, please wait while we review your order and update the
                    status through your contact details. Here are the list of items you have ordered.</div>}
            <CreateOverlay enableOverlay={overlay}/>
            <CustomerForm ref={childRef} formData={initFormData}/>
            {createLists}
            <NotesForm onChange={handleNotesChange} notes={notes} disabled='false'/>

            <button onClick={submitOrder}>Submit Order</button>
        </>
    );
}

export default ReviewOrderMenu_bkp2;
