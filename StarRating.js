import { useState } from "react";

const StarRating = ({ value, onChange }) => {
    const [rating, setRating] = useState(value);

    const handleClick = (newRating) => {
        setRating(newRating);
        if (onChange) onChange(newRating);
    };

    return (
        <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className={`star ${star <= rating ? 'filled' : ''}`}
                    onClick={() => handleClick(star)}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
};

export default StarRating;