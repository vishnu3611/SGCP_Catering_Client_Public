import { useCombobox } from "downshift";
import React, {useContext, useEffect, useState} from "react";
import cx from "classnames";
import {ProductsDataContext} from "../App";

function AutocompleteInput(props) {
    const { productsJSON } = useContext(ProductsDataContext);
    const [searchText, setSearchText] = useState("");
    const [items, setItems] = useState(productsJSON);

    function getProductFilter(inputValue) {
        return function productFilter(product) {
            return (
                !inputValue ||
                product.productName
                    .toLowerCase()
                    .includes(inputValue.toLowerCase())
            );
        };
    }

    const {
        isOpen,
        getToggleButtonProps,
        getLabelProps,
        getMenuProps,
        getInputProps,
        highlightedIndex,
        getItemProps,
        selectedItem,
    } = useCombobox({
        onInputValueChange({ inputValue }) {
            setSearchText(inputValue);
            setItems(productsJSON.filter(getProductFilter(inputValue)));
        },
        items,
        itemToString(item) {
            return item ? item.productName : "";
        },
        onSelectedItemChange({ selectedItem }) {
            props.addToCart(selectedItem.productID);
            setSearchText("");
        },
    });

    return (
        <div className="autocomplete-input">
            <label {...getLabelProps()}>Enter product name to add</label>
            <div className="flex  gap-0.5">
                <input
                    placeholder="Enter product name to add"
                    {...getInputProps({
                        onKeyDown: (event) => {
                            switch (event.key) {
                                case "Enter": {
                                    event.preventDefault();
                                    console.log(selectedItem
                                        , "dd")
                                    if (!selectedItem) {
                                        props.AddCustomCart(searchText)
                                    }
                                }
                            }
                        },
                    })}
                />
                {/*                <button
                    aria-label="toggle menu"
                    className="px-2"
                    type="button"
                    {...getToggleButtonProps()}
                >
                    {isOpen ? <>&#8593;</> : <>&#8595;</>}
                </button>
 */}{" "}
            </div>
            <ul
                {...getMenuProps()}
                className="absolute "
                // className="absolute p-0 w-72 bg-white shadow-md max-h-80 overflow-scroll"
            >
                {isOpen &&
                    items.map((item, index) => (
                        <li
                            className={cx(
                                highlightedIndex === index && "bg-lightgray",
                                selectedItem === item && "font-bold",
                                "py-2 px-3 shadow-sm"
                            )}
                            key={item.productID}
                            {...getItemProps({
                                item,
                                index,
                                style: {
                                    backgroundColor:
                                        highlightedIndex === index
                                            ? "lightgray"
                                            : "white",
                                    fontWeight:
                                        highlightedIndex === index
                                            ? "bold"
                                            : "normal",
                                },
                            })}
                        >
                            {item.productName}
                        </li>
                    ))}
            </ul>
        </div>
    );
}

export default AutocompleteInput;
