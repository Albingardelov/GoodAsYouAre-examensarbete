import { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import { useLocale } from '../../hooks/useLocale';
import { WaveDivider } from '../../components/WaveDivider/WaveDivider';
import styles from './ContactPage.module.css';

const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  as string;

const T = {
  sv: {
    h1: 'Kontakt',
    sub: 'Fyll i formuläret nedan så hör jag av mig så snart jag kan.',
    name: 'Namn',
    email: 'E-post',
    message: 'Meddelande',
    submit: 'Skicka',
    sending: 'Skickar…',
    successH2: 'Tack för ditt meddelande!',
    successP: 'Jag återkommer till dig inom kort.',
    errorP: 'Något gick fel. Försök igen eller maila mig direkt.',
  },
  en: {
    h1: 'Contact',
    sub: "Fill in the form below and I'll get back to you as soon as possible.",
    name: 'Name',
    email: 'Email',
    message: 'Message',
    submit: 'Send',
    sending: 'Sending…',
    successH2: 'Thank you for your message!',
    successP: "I'll get back to you shortly.",
    errorP: 'Something went wrong. Please try again or email me directly.',
  },
};

export function ContactPage() {
  const { locale } = useLocale();
  const t = T[locale];

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formRef.current) return;
    setStatus('sending');
    try {
      await emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, { publicKey: PUBLIC_KEY });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.h1}>{t.h1}</h1>
          <p className={styles.sub}>{t.sub}</p>
        </div>
      </section>

      <WaveDivider topColor="#f0ece5" bottomColor="#faf8f5" />

      <section className={styles.formSection}>
        <div className={styles.card}>
          {status === 'success' ? (
            <div className={styles.successCard}>
              <span className={styles.successIcon} aria-hidden="true">✓</span>
              <h2 className={styles.successH2}>{t.successH2}</h2>
              <p className={styles.successP}>{t.successP}</p>
            </div>
          ) : (
            <form ref={formRef} className={styles.form} onSubmit={handleSubmit} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-name">
                  {t.name}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className={styles.input}
                  required
                  autoComplete="name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-email">
                  {t.email}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className={styles.input}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="contact-message">
                  {t.message}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className={styles.textarea}
                  required
                />
              </div>

              {status === 'error' && (
                <p className={styles.errorMsg} role="alert">{t.errorP}</p>
              )}

              <button type="submit" className={styles.submitBtn} disabled={status === 'sending'}>
                {status === 'sending' ? t.sending : t.submit}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
