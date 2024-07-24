import React, { useState } from 'react';

const CommentsForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: ''
    });
    const [errors, setErrors] = useState({});

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault(); 
        const validationErrors = validateForm(formData); 
        if (Object.keys(validationErrors).length === 0) {
            // If no validation errors, handle successful form submission
            alert('Comment submitted successfully!');
            setFormData({ name: '', email: '', comment: '' }); 
        } else {
            // Set validation errors if any
            setErrors(validationErrors); 
        }
    };

    // Function to handle input changes in the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Remove validation error for the current input when value changes
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    // Function to validate form data
    const validateForm = (data) => {
        let errors = {};

        if (!data.name.trim()) {
            errors.name = 'Name is required';
        }

        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (!data.comment.trim()) {
            errors.comment = 'Comment is required';
        }

        return errors;
    };

    return (
        <div className="container mt-4">
            <h2>Comment</h2>
            <form onSubmit={handleSubmit}>
                {/* Name input field */}
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                {/* Email input field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                {/* Comment textarea field */}
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment</label>
                    <textarea
                        className={`form-control ${errors.comment ? 'is-invalid' : ''}`}
                        id="comment"
                        name="comment"
                        value={formData.comment}
                        onChange={handleChange}
                        rows="4"
                    ></textarea>
                    {errors.comment && <div className="invalid-feedback">{errors.comment}</div>}
                </div>
                {/* Submit button */}
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};

export default CommentsForm;
