import React, {useContext, useEffect, useState} from 'react';
import "../assets/menueditor.scss";
import {ProductsDataContext} from "../App";
import {server} from "../constants";



function EditList({products, setProducts, selectedProducts, setSelectedProducts}) {
    const uniqueCategories = [...new Set(products.map(item => item.categoryName))];
    const [highestID, setHighestID] = useState(getHighestID(products));
    const [showPriceList, setShowPriceList] = useState(false);

  const togglePriceList = () => {
    setShowPriceList(!showPriceList);
    console.log(showPriceList)
  };


      function getHighestID(products) {
    if (products.length === 0) {
      return 0; // Return 0 if the products list is empty
    }

    const ids = products.map(product => product.productID);
    return Math.max(...ids);
  }

    const handleChange = (e, productID) => {
        if (e.target.checked) {
            setSelectedProducts(prevSelected => [...prevSelected, productID]);
        } else {
            setSelectedProducts(prevSelected => prevSelected.filter(id => id !== productID));
        }
        console.log(selectedProducts)
    };

       // Function to handle changes in price values
  const handlePriceChange = (e, productID, priceKey) => {
    const { value } = e.target;

    setProducts(prevProducts =>
      prevProducts.map(product => {
        if (product.productID === productID) {
          return {
            ...product,
            priceList: {
              ...product.priceList,
              [priceKey]: value
            }
          };
        }
        return product;
      })
    );
  };
    const handleAddProduct = (e, categoryName) => {
        const productName = e.target.value.trim();

        if (productName !== "") {
            const newProduct = {
                productID: highestID + 1,
                categoryName: categoryName,
                productName: productName,
                show: false,
                remove: false,
                priceList: {
                    Each: 0,
                    Lb: 0,
                    "X-Small Tray": 0,
                    "Small Tray": 0,
                    "Medium Tray": 0,
                    "Full Tray": 0,
                    "Need Estimate": 0
                }
            };

            setProducts(prevProducts => [...prevProducts, newProduct]);
            setHighestID(prevHighestID => prevHighestID + 1); // Update the highest ID
            e.target.value = ""; // Reset the input field after adding the product
        }
    };

    const handleKeyDown = (e, category) => {
        if (e.key === "Enter") {
            handleAddProduct(e, category);
        }
    };

  function createShortForm(str) {
    if (!str) {
      return "";
    }
    // Match the first letter of each word and any optional whitespace after it
    const regex = /(\w)\w*\s*/g;
    // Replace each match with the first letter and a dot
    const shortForm = str.replace(regex, "$1.");
    // Return the resulting string in uppercase
      if(str === "X-Small Tray") return "X.S."
    return shortForm.toUpperCase();
  }
    return (
        <>
                 <div className="sticky-button">
        <button onClick={togglePriceList}>
          <i className={`las ${showPriceList ? 'la-eye-slash' : 'la-eye'}`}></i>
        </button>
      </div>
            <div className="category__list">
                {uniqueCategories.map(category => (
                    <div key={category} className="category__item">
                        <header className="menu-section">{category} </header>
                        <div className="products__list">
                            {products
                                .filter(product => product.categoryName === category)
                                .map(({ productID, productName, priceList }) => (
                                    <div key={productID} className="product__list__item">
                                        <div className="product__checkbox">
                                            <input
                                                type="checkbox"
                                                name={productID}
                                                onChange={e => handleChange(e, productID)}
                                                checked={selectedProducts.includes(productID)}
                                            />
                                            <label htmlFor={productID}>{productName}</label>
                                            {selectedProducts.includes(productID) ? (
                                                <i
                                                    className="las la-plus-square"
                                                    onClick={() =>
                                                        setSelectedProducts(prevSelected =>
                                                            prevSelected.filter(id => id !== productID)
                                                        )
                                                    }
                                                ></i>
                                            ) : (
                                                <></>
                                            )}

                                        </div>

                                                                                    <div className={`product__price-list ${showPriceList ? 'show' : 'hide'}`}>
                                                {Object.entries(priceList).map(([key, value]) => (
                                                    <div key={key} className={`price__item`}>
                                                        <label
                                                            className="price__label"
                                                            htmlFor={key}>{createShortForm(key)}</label>
                                                        <input
                                                            className="price__input"
                                                            type="text"
                                                            id={key}
                                                            value={value}
                                                            onChange={e =>
                                                                handlePriceChange(e, productID, key)
                                                            }
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                    </div>
                                ))}

                            <div className="add-product__container">
                                <input
                                    type="text"
                                    placeholder="Product Name"
                                    onKeyDown={e => handleKeyDown(e, category)}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}


function MenuEditor() {
    const { productsJSON } = useContext(ProductsDataContext);
    const [products, setProducts] = useState(productsJSON);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedRevision, setSelectedRevision] = useState('');
    const [revisions, setRevisions] = useState({});
    const [newRevision, setNewRevision] = useState('');


    useEffect(() => {
        fetch(server + '/revisions')
            .then((response) => response.json())
            .then((data) => {
                setRevisions(data.revisions);
                setSelectedRevision(data.current);
            })
            .catch((error) => console.error('Error fetching revisions:', error));
    }, []);
    useEffect(() => {
  const selectedProjects = revisions[selectedRevision] || [];
  setSelectedProducts(selectedProjects);
}, [selectedRevision]);

    const handleRevisionChange = (event) => {
        const selectedRevision = event.target.value;
        setSelectedRevision(selectedRevision);

        // Retrieve the selected projects for the selected revision
        const selectedProducts= revisions[selectedRevision] || [];
        setSelectedProducts(selectedProducts);
        console.log(selectedProducts)
    };
    const handleNewRevisionChange = (event) => {
        setNewRevision(event.target.value);
    };

    const handleLoadRevision = () => {
        if (newRevision.trim() !== '') {
            const updatedRevisions = { ...revisions };
            updatedRevisions[newRevision] = selectedProducts;
            setSelectedRevision(newRevision);
            setRevisions(updatedRevisions);
            setSelectedProducts([]);
            setNewRevision('');
        }
    };


    const handleSaveRevision = (applychanges:false) => {
        if (selectedRevision !== '') {
            const filterProducts = products.map((product) => {
                console.log(selectedProducts, product.productID)
                if (selectedProducts.includes(product.productID)) {
                    return { ...product, show: true };
                } else {
                    return { ...product, show: false };
                }
            });

            const payload = {
                revision: selectedRevision,
                revData: selectedProducts,
                changeRevision: applychanges,
                productsData: filterProducts
            };

            const token = localStorage.getItem("jwt");
            fetch(server + '/saverevision', {
                method: 'POST',
                headers: {
                    Authorization: `${token}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log(data.message);
                    alert('Revision saved set to Default')
                    // Perform any additional actions upon successful save
                })
                .catch((error) => {
                    console.error('Error saving revision:', error);
                    // Perform any error handling or display an error message
                });
        } else {
            console.log('No revision selected.');
            // Perform any error handling or display an error message
        }
    };


    return (
        <>
        <div>
            <h3>Menu Selector</h3>

            <select value={selectedRevision} onChange={handleRevisionChange}>
                <option value="">Select a Menu</option>
                {Object.entries(revisions).map(([revision, values]) => (
                    <option key={revision} value={revision}>
                        {revision}
                    </option>
                ))}
            </select>
            <div>
                <input
                    type="text"
                    placeholder="Enter a new revision"
                    value={newRevision}
                    onChange={handleNewRevisionChange}
                />
                <button onClick={handleLoadRevision}>Add</button>
            </div>
            <button onClick={() => handleSaveRevision(true)}>Save & Set Default</button>
        </div>
            <EditList products={products} setProducts={setProducts}
                      selectedProducts={selectedProducts} setSelectedProducts={setSelectedProducts}
            />
        </>
    );
}

export default MenuEditor;
