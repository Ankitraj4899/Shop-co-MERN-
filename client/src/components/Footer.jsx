import { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";

import visa from "../assets/icons/Visa.png";
import mastercard from "../assets/icons/Mastercard.png";
import paypal from "../assets/icons/Paypal.png";
import gpay from "../assets/icons/G Pay.png";
import apple from "../assets/icons/apple.png";

import x from "../assets/icons/x.png";
import f from "../assets/icons/f.png";
import g from "../assets/icons/g.png";
import i from "../assets/icons/i.png";

const Footer = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const emailToSubscribe = newsletterEmail.trim();
    if (!emailToSubscribe) return;

    setIsSending(true);
    setFeedbackMessage("");

    const serviceId = (import.meta.env.VITE_EMAILJS_SERVICE_ID || "service_meazrrh").trim();
    const templateId = (import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "template_ud8hgpq").trim();
    const publicKey = (import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "F6JBIqAWM-dbGnBHG").trim();

    try {
      console.log("Sending EmailJS request with:", { serviceId, templateId, publicKey, emailToSubscribe });

      const res = await emailjs.send(
        serviceId,
        templateId,
        {
          name: emailToSubscribe,
          email: emailToSubscribe,
          user_email: emailToSubscribe,
          to_email: emailToSubscribe,
          title: "Newsletter Subscription",
          message: `New newsletter subscription request from user email: ${emailToSubscribe}`,
        },
        publicKey
      );

      console.log("EmailJS Success Response:", res);
      setNewsletterSubscribed(true);
      setFeedbackMessage(`✓ Subscription request sent successfully for ${emailToSubscribe}!`);
      setNewsletterEmail("");
      setTimeout(() => {
        setNewsletterSubscribed(false);
        setFeedbackMessage("");
      }, 5000);
    } catch (error) {
      console.error("EmailJS Execution Error:", error);
      setNewsletterSubscribed(false);
      const errMsg = error?.text || error?.message || "Error sending EmailJS message";
      setFeedbackMessage(`❌ EmailJS Error: ${errMsg}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <footer className="site-footer">
      <section className="newsletter">
        <h2>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h2>
        <form className="newsletter__form" onSubmit={handleNewsletterSubmit}>
          <div className="input-with-icon">
            <span className="mail-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M22 6L12 13L2 6" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <input
              type="email"
              placeholder="Enter your email address"
              aria-label="Email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
            />
          </div>
          <button className="button button--white" type="submit" disabled={isSending}>
            {isSending ? "Sending..." : newsletterSubscribed ? "Subscribed!" : "Subscribe to Newsletter"}
          </button>
          {feedbackMessage && <p className="newsletter-feedback">{feedbackMessage}</p>}
        </form>
      </section>

      <div className="footer__content">
        <div className="footer__brand">
          <h2 className="logo">SHOP.CO</h2>
          <p>We have clothes that suit your style and which you're proud to wear. From women to men.</p>
          <div className="social-links">
            <a href="#twitter" aria-label="Twitter"><img src={x} alt="Twitter" /></a>
            <a href="#facebook" aria-label="Facebook" className="facebook"><img src={f} alt="Facebook" /></a>
            <a href="#instagram" aria-label="Instagram"><img src={i} alt="Instagram" /></a>
            <a href="#github" aria-label="Github"><img src={g} alt="Github" /></a>
          </div>
        </div>

        <div className="footer__column">
          <h3>COMPANY</h3>
          <Link to="/#about">About</Link>
          <Link to="/#features">Features</Link>
          <Link to="/#works">Works</Link>
          <Link to="/#career">Career</Link>
        </div>

        <div className="footer__column">
          <h3>HELP</h3>
          <Link to="/#support">Customer Support</Link>
          <Link to="/#delivery">Delivery Details</Link>
          <Link to="/#terms">Terms & Conditions</Link>
          <Link to="/#privacy">Privacy Policy</Link>
        </div>

        <div className="footer__column">
          <h3>FAQ</h3>
          <Link to="/#account">Account</Link>
          <Link to="/#deliveries">Manage Deliveries</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/#payments">Payments</Link>
        </div>

        <div className="footer__column">
          <h3>RESOURCES</h3>
          <a href="#ebooks">Free eBooks</a>
          <a href="#tutorial">Development Tutorial</a>
          <a href="#blog">How to - Blog</a>
          <a href="#youtube">Youtube Playlist</a>
        </div>
      </div>

      <div className="footer__bottom">
        <span>Shop.co © 2000-2026, All Rights Reserved</span>
        <div className="payment-badges">
          <span className="pay-badge"><img src={visa} alt="Visa" /></span>
          <span className="pay-badge"><img src={paypal} alt="Paypal" /></span>
          <span className="pay-badge"><img src={mastercard} alt="Mastercard" /></span>
          <span className="pay-badge"><img src={apple} alt="Apple Pay" /></span>
          <span className="pay-badge"><img src={gpay} alt="Google Pay" /></span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
