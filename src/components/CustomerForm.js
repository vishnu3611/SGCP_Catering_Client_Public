import {
    forwardRef,
    useRef,
    useImperativeHandle,
    useState,
    useEffect,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CATERING_TIME, SPICE_LEVEL } from "../constants";
import DeliveryChargesModal from "./DeliveryChargesModal";
import ReusableModal from "./ReusableModal";

const now = new Date().toISOString().slice(0, 16);

const CustomerForm = forwardRef((props, ref) => {
    const [showAddress, setShowAddress] = useState(false);
    const [disabledDates, setDisabledDates] = useState([
        new Date("2023-05-14"),
        new Date("2023-05-21"),
    ]);
    const [deliveryModalOpen, setDeliveryModalOpen] = useState(false);

    const openDeliveryModal = () => {
        setDeliveryModalOpen(true);
    };

    const closeDeliveryModal = () => {
        setDeliveryModalOpen(false);
    };
    const [cateringTimeModal, setCateringTimeModal] = useState(false);

    const handleCTClose = () => setCateringTimeModal(false);
    const handleCTOpen = () => setCateringTimeModal(true);

    useImperativeHandle(ref, () => ({
        returnFormData() {
            if (!showAddress && formData.address) {
                formData.address = "";
            }
            return validateAll() === "Error" ? "Error" : formData;
        },
    }));
    const [formData, setFormData] = useState({
        name: "",
        mobile: "+1 ",
        email: "",
        adultCount: 0,
        kidsCount: 0,
        vegCount: 0,
        nonVegCount: 0,
        cateringDate: "",
        cateringTime: "",
        spiceLevel: SPICE_LEVEL[1],
        address: "",
        homeAddress: "",
    });

    const [errors, setErrors] = useState({
        name: "",
        mobile: "",
        email: "",
        adultCount: "",
        kidsCount: "",
        vegCount: "",
        nonVegCount: "",
        cateringDate: "",
        cateringTime: "",
        spiceLevel: "",
        address: "",
        homeAddress: "",
    });

    function validate(name, value) {
        switch (name) {
            case "name":
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: "Name is required",
                    }));
                    return "Error";
                } else if (value.length < 3) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: "Name must be at least 3 characters long",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        name: "",
                    }));
                }
                break;
            case "mobile":
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        mobile: "Mobile is required",
                    }));
                    return "Error";
                } else if (!/^.{15}$/.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        mobile: "Mobile must be a valid 10 digit US number",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        mobile: "",
                    }));
                }
                break;
            case "email":
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "Email is required",
                    }));
                    return "Error";
                } else if (!/^\S+@\S+$/.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "Email is invalid",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: "",
                    }));
                }
                break;
            case "adultCount":
                console.log("ddl", value);
                if (!value && value !== 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        adultCount: "Number of adults is required",
                    }));
                    console.log("dddl", value);
                    return "Error";
                } else if (value < 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        adultCount: "Number of adults must be greater than 0",
                    }));
                    console.log("dddjjddl", value);
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        adultCount: "",
                    }));
                    console.log("ddasdfasdfl", value);
                }
                break;

            case "kidsCount":
                if (!value && value !== 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        kidsCount: "Number of kids is required",
                    }));
                    return "Error";
                } else if (value < 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        kidsCount: "Number of kids must be atleast 0",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        kidsCount: "",
                    }));
                }
                break;

            case "nonVegCount":
                if (!value && value !== 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        nonVegCount: "Number of Non Veg Count is required",
                    }));
                    return "Error";
                } else if (value < 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        nonVegCount: "Number of Non Veg must be atleast 0",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        nonVegCount: "",
                    }));
                }
                break;

            case "vegCount":
                if (!value && value !== 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        vegCount: "Number of Vegetarians is required",
                    }));
                    return "Error";
                } else if (value < 0) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        vegCount: "Number of Vegetarians must be atleast 0",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        vegCount: "",
                    }));
                }
                break;

            case "cateringDate":
                const currentDate = new Date(value);
                const nextDate = new Date(
                    currentDate.setDate(currentDate.getDate() + 1)
                );
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cateringDate: "Catering date is required",
                    }));
                    return "Error";
                } else if (nextDate < new Date()) {
                    console.log(value, new Date(value), new Date());
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cateringDate: "Catering date must be in the future",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cateringDate: "",
                    }));
                }
                break;
            case "cateringTime":
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cateringTime: "Catering time is required",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        cateringTime: "",
                    }));
                }
                break;
            case "spiceLevel":
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        spiceLevel: "Spice level is required",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        spiceLevel: "",
                    }));
                }
                break;
            case "homeAddress":
                if (!value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        homeAddress: "Home address is required",
                    }));
                    return "Error";
                } else if (value.length < 3) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        homeAddress:
                            "Home address must be at least 3 characters long",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        homeAddress: "",
                    }));
                }
                break;
            case "address":
                if (showAddress && !value) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        address: "Address is required",
                    }));
                    return "Error";
                } else if (showAddress && value.length < 3) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        address: "Address must be at least 3 characters long",
                    }));
                    return "Error";
                } else {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        address: "",
                    }));
                }
                break;
            default:
                return "Success";
                break;
        }
    }

    function validateAll() {
        for (const property in formData) {
            const element = document.getElementById(property);

            const status = validate(property, formData[property]);
            if (status === "Error") {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                if(!errors[property]) {
                    alert("please enter valid " + property);
                }
                else alert(errors[property]);

                return "Error";
            }
        }
        return "Success";
    }

    function handleBlur(event) {
        const { name, value } = event.target;
        validate(name, value);
    }

    function handleChange(event) {
        let { name, value } = event.target;
        if (name == "mobile") {
            if (value.length < 3) return;
            // Remove any non-numeric characters from the input
            const numericValue = value.slice(3).replace(/\D/g, "");

            // Format the numeric value into the desired format
            let formattedValue = "";
            if (numericValue.length > 3) {
                formattedValue += `${numericValue.slice(0, 3)}-`;
                if (numericValue.length > 6) {
                    formattedValue += `${numericValue.slice(3, 6)}-`;
                    formattedValue += numericValue.slice(6, 10);
                } else {
                    formattedValue += numericValue.slice(3, 10);
                }
            } else {
                formattedValue += numericValue;
            }
            value = "+1 " + formattedValue;
        }

        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]:
                name === "adultCount" ||
                name === "kidsCount" ||
                name === "vegCount" ||
                name === "nonVegCount"
                    ? event.target.valueAsNumber
                    : value,
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        validate("name", formData.name);
        validate("mobile", formData.mobile);
        validate("email", formData.email);
        validate("adultCount", formData.adultCount);
        validate("kidsCount", formData.kidsCount);
        validate("vegCount", formData.vegCount);
        validate("nonVegCount", formData.nonVegCount);
        validate("cateringDate", formData.cateringDate);
        validate("cateringTime", formData.cateringTime);
        validate("spiceLevel", formData.spiceLevel);
        validate("address", formData.address);
        validate("homeAddress", formData.homeAddress);
    }

    return (
        <div>
            <div className="grid-container customer__details">
                <div>
                    <div className="form-box">
                        <label htmlFor="name">
                            Customer Name<span className="span-red">*</span>:{" "}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errors.name && (
                        <span className="error">{errors.name}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="mobile">
                            Mobile #<span className="span-red">*</span>:{" "}
                        </label>
                        <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={formData.mobile}
                            id="mobile"
                            name="mobile"
                            required
                        />
                    </div>
                    {errors.mobile && (
                        <span className="error">{errors.mobile}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="email">
                            Email<span className="span-red">*</span>:{" "}
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {errors.email && (
                        <span className="error">{errors.email}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label for="homeAddress">
                            Home Address<span className="span-red">*</span> :
                        </label>
                        <input
                            type="text"
                            placeholder=""
                            name="homeAddress"
                            onChange={handleChange}
                        />
                    </div>
                    {errors.homeAddress && (
                        <span className="error">{errors.homeAddress}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="adultCount">Adults Count: </label>
                        <input
                            type="number"
                            id="adultCount"
                            name="adultCount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.adultCount && (
                        <span className="error">{errors.adultCount}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="kidsCount">Kids Count: </label>
                        <input
                            type="number"
                            id="kidsCount"
                            name="kidsCount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.kidsCount && (
                        <span className="error">{errors.kidsCount}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="vegCount">Vegetarian Count: </label>
                        <input
                            type="number"
                            id="vegCount"
                            name="vegCount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.vegCount && (
                        <span className="error">{errors.vegCount}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="nonVegCount">Non-Vegetarian Count: </label>
                        <input
                            type="number"
                            id="nonVegCount"
                            name="nonVegCount"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                    </div>
                    {errors.nonVegCount && (
                        <span className="error">{errors.nonVegCount}</span>
                    )}
                </div>
                <div>
                    <div className="form-box">
                        <label htmlFor="cateringDate">
                            Catering Date<span className="span-red">*</span> :{" "}
                        </label>
                        <DatePicker
                            id="cateringDate"
                            onBlur={handleBlur}
                            name="cateringDate"
                            selected={formData.cateringDate}
                            onChange={(date) =>
                                setFormData({ ...formData, cateringDate: date })
                            }
                            minDate={new Date()}
                            maxDate={new Date("2030-06-14T00:00")}
                            format="yyyy-MM-dd"
                            className="caterindDate"
                        />
                    </div>
                    {errors.cateringDate && (
                        <span className="error">{errors.cateringDate}</span>
                    )}
                </div>
            </div>
            <div className="customer__details2">
                <div class="radio-container">
                    <div class="radio-label">
                        <label>
                            Catering Time<span className="span-red">*</span>:
                        </label>
                    </div>{" "}
                    <ReusableModal
                        title="Note"
                        content="If you need to place orders at different times, please create them individually."
                        showModal={cateringTimeModal}
                        handleCloseModal={handleCTClose}
                    />
                    <div class="radio-buttons">
                        {CATERING_TIME.map((time) => (
                            <label key={time}>
                                <input
                                    type="radio"
                                    id="cateringTime"
                                    name="cateringTime"
                                    value={time}
                                    checked={formData.cateringTime === time}
                                    onChange={(event) => {
                                        handleCTOpen();
                                        setFormData({
                                            ...formData,
                                            cateringTime: event.target.value,
                                        });
                                    }}
                                />
                                <span class="radio-button-label">{time}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div class="radio-container">
                    <div class="radio-label">
                        <label for="spiceLevel">Spice Level:</label>
                    </div>
                    <div class="radio-buttons">
                        {SPICE_LEVEL.map((level) => (
                            <label key={level}>
                                <input
                                    type="radio"
                                    id={level}
                                    name="spiceLevel"
                                    value={level}
                                    checked={formData.spiceLevel === level}
                                    onChange={(event) =>
                                        setFormData({
                                            ...formData,
                                            spiceLevel: event.target.value,
                                        })
                                    }
                                />
                                <span class="radio-button-label">{level}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div class="radio-container">
                    <div class="radio-label">
                        <label>Delivery:</label>
                    </div>
                    {deliveryModalOpen && (
                        <DeliveryChargesModal onClose={closeDeliveryModal} />
                    )}
                    <div class="radio-buttons">
                        <label>
                            <input
                                type="radio"
                                name="delivery"
                                value="true"
                                checked={showAddress}
                                onChange={() => {
                                    setShowAddress(true);
                                    openDeliveryModal();
                                }}
                            />
                            <span class="radio-button-label">Yes</span>
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="delivery"
                                value="false"
                                checked={!showAddress}
                                onChange={() => setShowAddress(false)}
                            />
                            <span class="radio-button-label">No</span>
                        </label>
                    </div>
                </div>
            </div>
            <div>
                {showAddress && (
                    <div className="address">
                        <label for="address">Catering Address :</label>
                        <input
                            id="address"
                            name="address"
                            className="form-box-input"
                            type="text"
                            placeholder="Enter Address"
                            name="address"
                            onChange={handleChange}
                        />
                        {errors.address && (
                            <span className="error">{errors.address}</span>
                        )}
                    </div>
                )}
                <p className="note">
                    <b>Note:&nbsp;</b> Delivery service is provided by a
                    third-party and the cost is based on the distance of the
                    delivery location.
                </p>
            </div>
        </div>
    );
});
export default CustomerForm;
