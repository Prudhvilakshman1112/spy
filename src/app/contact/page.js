export const metadata = {
  title: "Contact Us | SPY Multibrand Stores",
  description: "Get in touch with SPY Multibrand Stores. Visit our store in Nakkavanipalem, Visakhapatnam, or reach out on WhatsApp & Instagram.",
};

export default function ContactPage() {
  return (
    <section style={{ padding: '60px 0', minHeight: '60vh' }}>
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
          CONTACT US
        </h1>
        <p style={{ color: '#999', marginBottom: '40px', fontSize: '0.9rem' }}>
          We&apos;d love to hear from you. Reach out through any of the channels below.
        </p>

        <div style={{ display: 'grid', gap: '24px' }}>
          {/* WhatsApp */}
          <a href="https://wa.me/918756799899" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>WhatsApp</div>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>+91 87567 99899</div>
            </div>
          </a>

          {/* Instagram */}
          <a href="https://instagram.com/spy_multibrandstore" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="12" cy="12" r="5" fill="none" stroke="#fff" strokeWidth="2"/><circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Instagram</div>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>@spy_multibrandstore</div>
            </div>
          </a>

          {/* Phone */}
          <a href="tel:+918756799899"
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#00A699', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Call Us</div>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>+91 87567 99899</div>
            </div>
          </a>

          {/* Location */}
          <a href="https://maps.app.goo.gl/41CAi5fWutc65NKD8" target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', borderRadius: '12px', border: '1px solid #eee', textDecoration: 'none', color: 'inherit' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FF3B3B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Visit Our Store</div>
              <div style={{ color: '#999', fontSize: '0.85rem' }}>Nakkavanipalem, Visakhapatnam, AP 530013</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
