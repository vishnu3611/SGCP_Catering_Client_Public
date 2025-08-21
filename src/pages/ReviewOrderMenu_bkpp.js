import * as React from 'react';
import {useState} from 'react';
import CreateOverlay from "../components/CreateOverlay";
import OrderMenu from "./OrderMenu";

function ReviewOrderMenu_bkpp() {
    const [overlay, setOverlay] = useState(true);


    return (
        <>
            {overlay && <div className="info">Thank you for ordering, please wait while we review your order and update the status through your contact details. Here are the list of items you have ordered.</div> }
            <CreateOverlay enableOverlay={overlay} />
            <OrderMenu />
        </>
    );
}

export default ReviewOrderMenu_bkpp;