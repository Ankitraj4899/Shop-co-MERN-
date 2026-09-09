import StarRating from "../StarRating";

const testimonialsList = [
  {
    name: "Sarah M.",
    quote:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
    verified: true,
  },
  {
    name: "Alex K.",
    quote:
      "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable.",
    verified: true,
  },
  {
    name: "James L.",
    quote:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection is diverse and on-point.",
    verified: true,
  },
  {
    name: "Emily R.",
    quote:
      "The fit and finish of their denim collection is top-tier. Fast delivery, easy checkout, and the fabric feels amazingly premium.",
    verified: true,
  },
  {
    name: "Michael B.",
    quote:
      "Shop.co is my go-to for wardrobe essentials. Great customer support, consistent sizing, and modern cuts that look sharp anywhere.",
    verified: true,
  },
];

const TestimonialsSection = ({ testimonialIndex, onPrev, onNext }) => {
  const visibleTestimonials = testimonialsList.slice(
    testimonialIndex,
    testimonialIndex + 3
  );

  return (
    <section className="testimonials">
      <div className="testimonials__header">
        <h2>OUR HAPPY CUSTOMERS</h2>
        <div className="carousel-nav">
          <button type="button" onClick={onPrev} aria-label="Previous review">
            ←
          </button>
          <button type="button" onClick={onNext} aria-label="Next review">
            →
          </button>
        </div>
      </div>
      <div className="testimonial-grid">
        {visibleTestimonials.map((t) => (
          <article className="testimonial-card" key={t.name}>
            <div className="stars">
              <StarRating rating={5} size={20} />
            </div>
            <h3>
              {t.name}{" "}
              {t.verified && (
                <span
                  className="verified-badge"
                  aria-label="Verified Customer"
                  title="Verified Customer"
                >
                  ✓
                </span>
              )}
            </h3>
            <p>"{t.quote}"</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export { testimonialsList };
export default TestimonialsSection;
