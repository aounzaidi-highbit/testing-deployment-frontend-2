import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import tickIcon from "../../assets/icons/tick.svg";
import { addReview, getSingleProfiles, reviewGet } from "../../services/business";
import { setupAxios } from "../../utils/axiosClient";
import { StarRating } from "../../utils/helper";

const AddReview = ({ brandId }) => {
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [title, setTitle] = useState("");
    const [loadingReview, setLoadingReview] = useState(false);
    const [base64Image, setBase64Image] = useState("");
    // const [allReview, setAllReview] = useState([]);
    const [file, setFile] = useState(null);
    // const [loading, setLoading] = useState(true);
    // const [profile, setProfile] = useState([]);

    const [submitSuccess, setSubmitSuccess] = useState(false);
    // const [submitError, setSubmitError] = useState(false);
    // console.log("id form got = " + brandId);

    const bussiness = brandId;
    // console.log("id form bussiness = " + bussiness);

    useEffect(() => {
        getProfile();
        getReviews();
    }, [bussiness]);

    const AddReviews = async (e) => {
        e.preventDefault();
        setLoadingReview(true);
        setupAxios();
        setSubmitSuccess(false);
        // setSubmitError(false);
        const userId = localStorage.getItem("user_id");
        console.log("Retrieved User ID:", userId);

        // Convert bussiness to number and log for debugging
        const brandProfileId = parseInt(bussiness);
        console.log("Business ID:", brandProfileId);

        const payload = {
            description: review,
            proof_of_order: base64Image,
            brand_profile: brandProfileId,
            rating_title: title,
            rating: rating,
            user: userId,
        };
        console.log("Payload to be sent:", payload);

        try {
            const reviewResponse = await addReview(payload);
            console.log("Review submission response:", reviewResponse);

            const resp = await reviewGet(brandProfileId);
            console.log("Updated reviews fetched:", resp.data);

            // setAllReview(resp?.data);

            setSubmitSuccess(true);

            setRating(0);
            setReview("");
            setTitle("");
            setFile(null);
            setBase64Image("");
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);
        } catch (error) {
            // setSubmitError(true);

            if (error.response) {
                console.error("Error Response:", error.response);
            } else {
                console.error("Error Message:", error.message);
            }
        } finally {
            setLoadingReview(false);
            console.log("Review submission process completed.");
        }
    };


    const getProfile = async () => {
        setupAxios();
        try {
            const res = await getSingleProfiles(bussiness);
            // setProfile(res?.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getReviews = async () => {
        setLoadingReview(true);
        setupAxios();
        try {
            const res = await reviewGet(Number(bussiness));
            // setAllReview(res?.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingReview(false);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/jpeg, image/png",
        onDrop: (acceptedFiles) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBase64Image(reader.result);
            };
            reader.readAsDataURL(acceptedFiles[0]);
            setFile(acceptedFiles[0]);
        }
    });

    const stack2 = (
        <div
            {...getRootProps()}
            className="mt-[14px] bg-[#f3f8fb] w-full h-[142px] flex justify-center items-center rounded-md border-2 border-dotted border-primary"
        >
            <input {...getInputProps()} />
            <div className="w-full flex flex-col items-center justify-center">
                <div className="text-[16px] leading-[18px] text-[#0F0F0F]">
                    Drag & Drop File or <span className="text-primary">Browse</span>
                </div>
                <div className="mt-[10px] text-[10px] 2xl:text-[12px] font-normal leading-[12px] 2xl:leading-[18px] text-[#676767]">
                    {file?.name || "Supported formats: JPEG, PNG"}
                </div>
            </div>
        </div>
    );

    return (
        <div className="shadow-box-shadow rounded-3xl p-4 lg:p-10">
            <form onSubmit={AddReviews}>
                <div className="grid lg:grid-cols-1 gap-6 lg:mb-4 mb-4">
                    <div className="w-full ">
                        <label className="block capital text-[#000] text-lg lg:text-xl mb-2">
                            Choose Rate
                        </label>
                        <StarRating rating={rating} setRating={setRating} />
                    </div>
                </div>
                <span className="text-lg lg:text-xl">Proof of Order</span>
                {stack2}
                {file && (
                    <div className="mt-4">
                        <p>Preview:</p>
                        <img src={base64Image} alt="Preview" className="w-[200px] h-[150px] object-cover rounded-md" />
                    </div>
                )}
                <div className="lg:mb-6 mb-10">
                    <label htmlFor="message" className="mt-2 block capital text-[#000] text-lg lg:text-xl mb-2">
                        Title
                    </label>
                    <input
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        name="title"
                        className="w-full shadow-box-shadow text-black rounded-xl border p-4 focus:outline-Primary min-h-20 resize-none"
                        placeholder="Enter the title of review"
                    />
                </div>
                <div className="lg:mb-6 mb-10">
                    <label htmlFor="title" className="mt-2 block capital text-[#000] text-lg lg:text-xl mb-2">
                        Review
                    </label>
                    <textarea
                        required
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        id="message"
                        rows="7"
                        className="w-full shadow-box-shadow text-black rounded-xl border p-4 focus:outline-Primary min-h-20 resize-none"
                        placeholder="Write your review"
                    ></textarea>
                </div>
                {loadingReview ? (
                    <button
                        type="button"
                        className="bg-Primary text-xl flex items-center justify-center px-[31.5px] py-2 rounded-md text-white min-w-[16%]"
                    >
                        Submiting .....
                    </button>
                ) : submitSuccess ? (
                    <button
                        type="button"
                        className="bg-Primary text-xl py-2 px-3 flex gap-2.5 justify-center items-center rounded-md text-white min-w-[16%]"
                        disabled
                    >
                        <img src={tickIcon} className="w-7" alt="submit-icon" />
                        Submitted
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="bg-Primary min-w-[16%] text-lg lg:text-xl py-2 px-3 rounded-md text-white"
                    >
                        Submit Review
                    </button>
                )}
            </form>
        </div>
    );
};

export default AddReview;
