import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import './TestimonialSlider.css';

const TestimonialSlider = () => {
    const testimonials = [
        {
            name: "Alice Johnson",
            content: "FlyAir provided an excellent service. The flight was smooth and the staff were very courteous.",
        },
        {
            name: "Bob Smith",
            content: "I had a wonderful experience with FlyAir. The booking process was seamless and the flight was on time.",
        },
        {
            name: "Carol Williams",
            content: "Great experience with FlyAir. The customer service was top-notch and the flight was comfortable.",
        },
        {
            name: "David Brown",
            content: "FlyAir exceeded my expectations. The seats were comfortable and the in-flight entertainment was excellent.",
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="testimonial-slider">
            <Slider {...settings}>
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial">
                        <p className="testimonial-content">"{testimonial.content}"</p>
                        <p className="testimonial-author">- {testimonial.name}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default TestimonialSlider;
