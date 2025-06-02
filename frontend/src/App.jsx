import { useEffect } from "react";
import axios from "axios";

function App() {
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      // 1. Load Razorpay script dynamically
      const razorpayLoaded = await loadRazorpay();
      if (!razorpayLoaded) throw new Error("Razorpay SDK failed to load");

      // 2. Create order
      const { data } = await axios.post(
        "http://localhost:5000/api/create-payment",
        {
          amount: 5,
        }
      );

      // 3. Initialize Razorpay
      const options = {
        key: "rzp_test_2N5g4FkWkO2qej", // 👈 Only Key ID
        amount: 500, // ₹5 = 500 paise
        currency: "INR",
        name: "AI E-Book Store",
        description: "Purchase E-Book",
        handler(response) {
          alert(`Payment ID: ${response.razorpay_payment_id}`);
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert(`Payment failed: ${error.message}`);
    }
  };

  return <button onClick={handlePayment}>Buy for ₹5</button>;
}

export default App;
