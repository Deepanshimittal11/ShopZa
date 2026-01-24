import { useState } from "react";

const PaymentButton = ({ checkoutId, setOrderId }) => {
  const [finalizing, setFinalizing] = useState(false);
  const [paying, setPaying] = useState(false);
  const [finalizeError, setFinalizeError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const handlePayment = async () => {
    setFinalizeError("");
    setPaymentError("");
    setFinalizing(true);

    let id = null;

    try {
      // Step 1: Mark checkout as paid
      const payRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("userToken")}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: "paid", paymentDetails: { method: "Razorpay" } })
      });

      const payData = await payRes.json();

      if (!payRes.ok || !payData.isPaid) {
        setFinalizeError(payData.message || "Failed to mark checkout as paid.");
        setFinalizing(false);
        return;
      }

      // Step 2: Finalize checkout
      const finalizeRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("userToken")}`,
          'Content-Type': 'application/json',
        },
      });

      const finalizeData = await finalizeRes.json();

      if (!finalizeRes.ok || !finalizeData._id) {
        setFinalizeError(finalizeData.message || "Failed to finalize checkout.");
        setFinalizing(false);
        return;
      }

      id = finalizeData._id;
      setOrderId(id);
    } catch (err) {
      setFinalizeError("Error finalizing checkout. Please try again.");
      setFinalizing(false);
      return;
    }

    setFinalizing(false);

    if (!id || typeof id !== 'string' || id.length !== 24) {
      setPaymentError("Order ID is invalid. Cannot initiate payment.");
      return;
    }

    setPaying(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/payment/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("userToken")}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok && data.payment_link_url) {
        window.location.href = data.payment_link_url;
      } else {
        setPaymentError(data.message || "Failed to create payment link.");
      }
    } catch (err) {
      setPaymentError("Payment initiation failed. Please try again.");
    }

    setPaying(false);
  };

  return (
    <div>
      {finalizeError && <p className="text-red-600 mb-2">{finalizeError}</p>}
      {paymentError && <p className="text-red-600 mb-2">{paymentError}</p>}
      <button
        type="button"
        className={`w-full bg-blue-600 text-white py-3 rounded ${finalizing || paying ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={finalizing || paying}
        onClick={handlePayment}
      >
        {finalizing ? "Finalizing..." : paying ? "Redirecting..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentButton;