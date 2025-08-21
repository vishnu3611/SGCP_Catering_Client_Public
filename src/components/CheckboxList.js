import React, { useState } from 'react';

function CheckboxList({ items, onSelectionChange }) {
  const [selectedItems, setSelectedItems] = useState({});

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSelectedItems({ ...selectedItems, [name]: checked });
      onSelectionChange({ ...selectedItems, [name]: checked }, [name, checked]);
  };

  return (
    <div className="checkbox__items">
      {items.map((item) => (
        <div key={item.value}>
          <input
            type="checkbox"
            id={item.id}
            name={item.value}
            checked={selectedItems[item.value] || false}
            onChange={handleCheckboxChange}
          />
          <label htmlFor={item.id}>{item.label}</label>
        </div>
      ))}
    </div>
  );
}

export default CheckboxList;
