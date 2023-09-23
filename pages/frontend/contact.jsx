import React, { useState } from "react";
import NavBar from "@/components/NavBar";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can handle form submission here, e.g., send the data to a server

    console.log("Form data submitted:", formData);

    // Clear the form after submission
    setFormData({
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    });
  };

  return (
    <div>
      <NavBar />
      <div className="contact-form mt-24 max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Your Name"
              className="w-full py-2 px-3 rounded-full border focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Your Email"
              className="w-full py-2 px-3 rounded-full border focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              placeholder="Your Phone Number"
              className="w-full py-2 px-3 rounded-full border focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="mb-4">
            <textarea
              name="message"
              id="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Your Message"
              className="w-full py-2 px-3 rounded-lg border focus:outline-none focus:border-green-500"
              rows="4"
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-green-700 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full mx-auto block"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
