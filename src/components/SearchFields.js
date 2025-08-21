import React from 'react';


const SearchFields = ({ searchFields, customSearch, handleCustomSearch }) => {
  const renderField = (field) => {
    if (field.type === 'date') {
      return (
        <input
          type="date"
          id={field.name}
          value={customSearch[field.name]}
          onChange={(event) =>
            handleCustomSearch({
              ...customSearch,
              [field.name]: event.target.value,
            })
          }
        />
      );
    } else if (field.type === 'select') {
      return (
        <select
          id={field.name}
          value={customSearch[field.name]}
          onChange={(event) =>
            handleCustomSearch({
              ...customSearch,
              [field.name]: event.target.value,
            })
          }
        >
          {field.options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        id={field.name}
        value={customSearch[field.name]}
        onChange={(event) =>
          handleCustomSearch({
            ...customSearch,
            [field.name]: event.target.value,
          })
        }
      />
    );
  };

  return (
    <>
      {searchFields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          {renderField(field)}
        </div>
      ))}
    </>
  );
};

export default SearchFields;

