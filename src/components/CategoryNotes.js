import React from 'react';

const CategoryNotes = ({categories}) => {
    return (
        <div className="categorynotes__list">
            <div className="categorynotes__label"> Category Notes: </div>
            <ul>
                {Object.entries(categories).map(([categoryName, categoryNotes]) => {
                    if (categoryNotes) {
                        return (
                            <li key={categoryName}>
                               <span className="bold">{categoryName}</span> : {categoryNotes}
                            </li>
                        );
                    } else {
                        return null;
                    }
                })}
            </ul>
        </div>
    );
};

export default CategoryNotes;
