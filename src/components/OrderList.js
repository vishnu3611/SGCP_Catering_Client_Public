import * as React from 'react';
import {useEffect, useState} from "react";
import NotesForm from "./NotesForm";
import { uuid } from 'uuidv4';

let uniqueID = 0;

export default function OrderList({ cart, setCart, products, category, categoryNotes, setCategoryNotes}) {
    const [checkedProducts, setCheckedProducts] = useState([]);

    const addToCart = (productID, productName) => {
        const cartItem = {
            uid: uniqueID++,
            productID,
            productName,
            quantity: 1,
            size: "Need Estimate",
            price: 0
        }
        setCart([...cart, cartItem]);
    }


    useEffect(() => {
        const productIDs = cart.map(item => item.productID);
        setCheckedProducts(productIDs);
    }, []);

    const handleChange = (event, productID, productName) => {
        if(productName.toLowerCase().includes("naan")){
            alert("Order pickup for Naan at Lunch is  12:15pm and Dinner is 6:00pm");
        }
        if(event.target.checked) {
            setCheckedProducts([ ...checkedProducts, productID ]);
            addToCart(productID, productName);
        }
        else {
            const checkedProductsRemoveIfUnChecked = checkedProducts.filter(checkedProductID => checkedProductID !== productID)
            const removeCartItems = cart.filter(cartItem => cartItem.productID !== productID);
            setCheckedProducts(checkedProductsRemoveIfUnChecked);
            setCart([...removeCartItems]);
        }
    };
    const handleCategoryNotes = (event) => {
        setCategoryNotes({
            ...categoryNotes,
            [category]: event.target.value
        });
    };



    const cartIncludesProduct = (productID) => {
        return cart.find(cartItem => cartItem.productID === productID);
    }

    const updateCartItem = (uid, property, newValue) => {
        setCart(
            cart.map(cartItem => {
                const product = products.find( product => product.productID === cartItem.productID );
                if(cartItem.uid === uid) {
                    cartItem[property] = newValue;
                    cartItem['price'] = cartItem.quantity * product.priceList[cartItem.size];
                }
                return cartItem;
            })
        )
    }
    const selectedCartItems = (productID) => {
       const productsByIdFromCart = cart.filter(cartItem => cartItem.productID === productID);
        return productsByIdFromCart.map( ({uid, quantity, size, price, productName}) => {
            const GenerateOptions = () => {
                const product = products.find(product => product.productID === productID);
                return Object.entries(product.priceList).map(([size,price]) => {
                    return (
                        <option key={uuid()} value={size}>{size}</option>
                    )
                })
            }
            return (
                <div key={uid} className="selected__product__item">
                    <div className="selected__product__name">
                        <label htmlFor="productName"> Product Name: </label>
                        <div className="productName">{productName}</div>
                    </div>
                    <div className="selected__product__quantity">
                        <label htmlFor=""> Quantity : </label>
                        <input type="number" id="quantity" name="quantity" value={quantity} onChange={({target})=> updateCartItem( uid, "quantity", target.valueAsNumber )} />
                    </div>
                    <div className="tray__size">
                        <label htmlFor="size">Size:</label>
                        <select name="size" value={size} onChange={({target})=> updateCartItem( uid, "size", target.value )} >
                           <GenerateOptions />
                        </select>
                    </div>
                    <label htmlFor="price">Price: </label>
                    <div className="price">{price}</div>
                </div>
            )
        })
    }

    const selectedCartItemsForDesktop = () => {
        return products.map(product => selectedCartItems(product.productID))

    }

    function getWindowSize() {
        const {innerWidth, innerHeight} = window;
        return {innerWidth, innerHeight};
    }

    const createListItems = products.map(product => {
        const {productID, productName} = product;
        return (
              <div className="product__list__item">
                  <div className="product__checkbox">
                      <input type="checkbox" name={productID} onChange={(e) => handleChange(e, productID, productName)}/>
                      <label htmlFor={productID}> {productName}</label>
                      {
                          cartIncludesProduct(productID) ? <i className="las la-plus-square" onClick={() => addToCart(productID, productName)}></i> : <></>
                      }
                  </div>
                 { getWindowSize().innerWidth <= 600 && selectedCartItems(productID) }
              </div>
        )
    })

    return (
        <div className="category__item">
            <header className="menu-section">{category}</header>
            <div className="products__list">
                { createListItems }
                { getWindowSize().innerWidth > 600 && selectedCartItemsForDesktop() }
            </div>
                <div className="other__items">
                    <label htmlFor="">Other: </label>
                    <input type="text" name="categoryNote" value={categoryNotes[category]} onChange={handleCategoryNotes} />
                </div>
        </div>
    );
}
