import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mail, Phone } from 'lucide-react';
import { Button } from '../Button';

interface OTPVerificationPageProps {
  onNavigate?: (page: string) => void;
  onVerify?: (otp: string) => void;
  onResend?: () => void;
  verificationType?: 'email' | 'phone';
  contactInfo?: string;
}

export function OTPVerificationPage({ 
  onNavigate, 
  onVerify,
  onResend,
  verificationType = 'email',
  contactInfo = 'your.email@example.com'
}: OTPVerificationPageProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (newOtp.every(digit => digit !== '') && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp.slice(0, 6));
    
    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = (code: string) => {
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    onVerify?.(code);
  };

  const handleResend = () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');
    inputRefs.current[0]?.focus();
    onResend?.();
  };

  return (
    <div className="min-h-screen bg-background-secondary flex flex-col">
      {/* Back Button */}
      <div className="p-4">
        <button
          onClick={() => onNavigate?.('signup')}
          className="flex items-center gap-2 text-foreground-secondary hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      {/* Verification Form */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {/* Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-deep-blue/10 rounded-full mb-6">
              {verificationType === 'email' ? (
                <Mail className="w-10 h-10 text-deep-blue" />
              ) : (
                <Phone className="w-10 h-10 text-deep-blue" />
              )}
            </div>
            <h1 className="text-3xl mb-2">Verify Your {verificationType === 'email' ? 'Email' : 'Phone'}</h1>
            <p className="text-foreground-secondary">
              We sent a 6-digit code to<br />
              <span className="font-medium text-foreground">{contactInfo}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-semibold rounded-lg border-2 transition-all ${
                    error 
                      ? 'border-destructive focus:border-destructive' 
                      : 'border-input-border focus:border-deep-blue'
                  } focus:outline-none`}
                />
              ))}
            </div>

            {error && (
              <p className="text-destructive text-sm text-center mb-4">{error}</p>
            )}

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full mb-4"
              onClick={() => handleVerify(otp.join(''))}
              disabled={otp.some(digit => digit === '')}
            >
              Verify Code
            </Button>

            {/* Resend */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-deep-blue hover:text-deep-blue-dark font-medium transition-colors"
                >
                  Resend Code
                </button>
              ) : (
                <p className="text-foreground-secondary text-sm">
                  Resend code in <span className="font-medium text-foreground">{countdown}s</span>
                </p>
              )}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center text-sm text-foreground-secondary">
            <p>Didn't receive the code? Check your spam folder or</p>
            <button className="text-deep-blue hover:text-deep-blue-dark font-medium transition-colors">
              use a different {verificationType === 'email' ? 'email' : 'phone number'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
