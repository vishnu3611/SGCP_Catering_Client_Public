import * as React from 'react';
import { useState } from 'react';

function CreateOverlay(props) {
    const [isOverlayOpen, setIsOverlayOpen] = useState(props.enableOverlay);

    return (
        <div>
            {isOverlayOpen && (
                <div
                    className="overlay"
                    // onClick={() => setIsOverlayOpen(false)}
                ></div>
            )}
        </div>
    );
}

export default CreateOverlay;