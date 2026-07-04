export function LocationSection() {
  const address = "Jalan Villa Bukit Mas F2, Villa Jepang, Dukuh Pakis, Kec. Dukuhpakis, Surabaya, Jawa Timur 60225";
  const mapsLink = `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <section className="bg-surface border-t border-mist">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Text Info */}
          <div>
            <h2 className="text-lg font-medium tracking-tight text-ink mb-4">Visit Our Studio</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">Address</p>
                <p className="text-sm text-ink leading-relaxed">{address}</p>
              </div>
              <div>
                <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">Hours</p>
                <p className="text-sm text-ink">Tuesday - Sunday, 9am - 5pm</p>
                <p className="text-sm text-ink mt-2">
                  Or{' '}
                  <a
                    href="/appointments"
                    className="underline hover:text-gold transition-colors font-medium"
                  >
                    Schedule an Appointment
                  </a>
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide-label uppercase text-graphite mb-2">Contact</p>
                <a
                  href="tel:+6281335838367"
                  className="text-sm text-ink hover:text-gold transition-colors font-medium"
                >
                  +62 813-3583-8367
                </a>
              </div>
              <div className="pt-4">
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm tracking-wide-label uppercase px-4 py-2.5 border border-ink text-ink hover:bg-ink hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Open in Maps
                </a>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <div>
            <iframe
              title="De Ritz Atelier Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.3850223685707!2d110.42099!3d-7.254!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a15b6d2d2d2d%3A0x2d2d2d2d2d2d2d2d!2sJalan%20Villa%20Bukit%20Mas%2C%20Dukuh%20Pakis%2C%20Surabaya!5e0!3m2!1sen!2sid!4v1234567890"
              width="100%"
              height="280"
              style={{ border: 0, borderRadius: '4px' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded border border-mist"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
