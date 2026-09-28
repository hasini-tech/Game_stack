import React, { FormEvent, useEffect, useState } from 'react';
import { Loader2, Mail, MessageCircle, Phone, ShieldCheck, User, X } from 'lucide-react';
import { getProductById } from '../data/products';
import { SaaSProductId } from '../types/game';

interface LeadCaptureModalProps {
  productId: SaaSProductId;
  onClose: () => void;
  onSaved: (lead: { id: string; fullName: string }) => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  productId,
  onClose,
  onSaved,
}) => {
  const product = getProductById(productId);
  const [fullName, setFullName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [whatsappOtp, setWhatsappOtp] = useState('');
  const [otpChallengeId, setOtpChallengeId] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (resendIn <= 0) return;

    const timer = window.setInterval(() => {
      setResendIn((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [resendIn]);

  const requestOtp = async () => {
    if (!/^\d{10}$/.test(whatsappNumber)) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsappNumber }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Could not send the WhatsApp OTP.');
      }

      setOtpChallengeId(String(payload.challengeId));
      setWhatsappOtp('');
      setResendIn(Number(payload.retryAfterSeconds) || 60);
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : 'Could not send the WhatsApp OTP.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!/^\d{10}$/.test(whatsappNumber)) {
      setError('Please enter a valid 10-digit WhatsApp number.');
      return;
    }

    if (!otpChallengeId) {
      await requestOtp();
      return;
    }

    if (!/^\d{6}$/.test(whatsappOtp)) {
      setError('Please enter the 6-digit WhatsApp OTP.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          whatsappNumber,
          email,
          otpChallengeId,
          whatsappOtp,
          sourceProductId: product.id,
          sourceProductName: product.name,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || 'Could not submit your details.');
      }

      onSaved({
        id: String(payload.id),
        fullName: String(payload.fullName || fullName),
      });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#f5fff8]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-2xl border border-[#d9e8df] bg-[#f5fff8] p-5 text-left shadow-2xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-black/50">
                Expo Access
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[#d9e8df] bg-white text-black transition-colors hover:bg-[#e6f8e6]"
            aria-label="Close form"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-black/60">
              Full Name
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-[#d9e8df] bg-white px-3 py-2.5 focus-within:border-[#1b9e4b]">
              <User className="h-4 w-4 text-black/50" />
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                required
                minLength={2}
                maxLength={80}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none"
                placeholder="Enter full name"
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-black/60">
              WhatsApp Number (10 digits)
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-[#d9e8df] bg-white px-3 py-2.5 focus-within:border-[#1b9e4b]">
              <Phone className="h-4 w-4 text-black/50" />
              <input
                value={whatsappNumber}
                onChange={(event) => {
                  const nextNumber = event.target.value.replace(/\D/g, '').slice(0, 10);
                  setWhatsappNumber(nextNumber);
                  if (otpChallengeId) {
                    setOtpChallengeId(null);
                    setWhatsappOtp('');
                    setResendIn(0);
                  }
                }}
                required
                type="tel"
                inputMode="numeric"
                minLength={10}
                maxLength={10}
                pattern="[0-9]{10}"
                autoComplete="tel"
                title="Enter a 10-digit WhatsApp number"
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none"
                placeholder="Enter 10-digit number"
              />
            </span>
          </label>

          {otpChallengeId && (
            <label className="block">
              <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-black/60">
                WhatsApp OTP
              </span>
              <span className="flex items-center gap-2 rounded-lg border border-[#d9e8df] bg-white px-3 py-2.5 focus-within:border-[#1b9e4b]">
                <ShieldCheck className="h-4 w-4 text-black/50" />
                <input
                  value={whatsappOtp}
                  onChange={(event) => setWhatsappOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  type="tel"
                  inputMode="numeric"
                  minLength={6}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  autoComplete="one-time-code"
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold tracking-[0.3em] text-black outline-none"
                  placeholder="Enter 6-digit OTP"
                />
              </span>
              <span className="mt-1.5 flex items-center justify-between gap-3 text-[10px] font-semibold text-black/50">
                <span>Code sent to +91 {whatsappNumber}</span>
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={isSubmitting || resendIn > 0}
                  className="inline-flex shrink-0 items-center gap-1 text-black underline underline-offset-2 transition-colors hover:text-[#1b9e4b] disabled:cursor-not-allowed disabled:no-underline disabled:opacity-50"
                >
                  <MessageCircle className="h-3 w-3" />
                  {resendIn > 0 ? `Resend in ${resendIn}s` : 'Send again'}
                </button>
              </span>
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-black/60">
              Email
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-[#d9e8df] bg-white px-3 py-2.5 focus-within:border-[#1b9e4b]">
              <Mail className="h-4 w-4 text-black/50" />
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                type="email"
                maxLength={120}
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-black outline-none"
                placeholder="name@example.com"
              />
            </span>
          </label>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1b9e4b] px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-black shadow-lg transition-colors hover:bg-[#17903f] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            <span>
              {isSubmitting
                ? otpChallengeId
                  ? 'Verifying'
                  : 'Sending OTP'
                : otpChallengeId
                  ? 'Verify & Play'
                  : 'Send WhatsApp OTP'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
