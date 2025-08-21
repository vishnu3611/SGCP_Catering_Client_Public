import React from "react";

function NotesForm({ onChange, notes, disabled, ...rest }) {
    console.log(rest);
    return (
        <div class="notes">
            <label class="notes-label" for="notes">
                {rest.label ? rest.label : "Notes:"}
            </label>
            <textarea
                class="notes-textarea"
                id="notes"
                name="notes"
                rows="5"
                cols="33"
                value={notes}
                onChange={onChange}
                disabled={disabled}
            ></textarea>
        </div>
    );
}

export default NotesForm;
