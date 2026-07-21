"use client";

import { useState } from 'react';
import Script from 'next/script';
import LandingScreen from '@/components/membership/LandingScreen';
import MobileInputScreen from '@/components/membership/MobileInputScreen';
import OtpVerificationScreen from '@/components/membership/OtpVerificationScreen';
import AccountDetailsScreen from '@/components/membership/AccountDetailsScreen';
import PlanSelectionScreen from '@/components/membership/PlanSelectionScreen';
import PaymentSuccessScreen from '@/components/membership/PaymentSuccessScreen';
import MembershipDashboard from '@/components/membership/MembershipDashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export type MembershipStep = 
  | 'LANDING' 
  | 'MOBILE_INPUT' 
  | 'OTP_VERIFY' 
  | 'ACCOUNT_DETAILS' 
  | 'PLAN_SELECTION' 
  | 'PAYMENT_SUCCESS' 
  | 'DASHBOARD';

export default function MembershipPage() {
  const [step, setStep] = useState<MembershipStep>('LANDING');
  const [mobile, setMobile] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [membershipDetails, setMembershipDetails] = useState<any>(null);

  const renderStep = () => {
    switch (step) {
      case 'LANDING':
        return <LandingScreen onNext={() => setStep('MOBILE_INPUT')} />;
      case 'MOBILE_INPUT':
        return <MobileInputScreen mobile={mobile} setMobile={setMobile} onNext={() => setStep('OTP_VERIFY')} />;
      case 'OTP_VERIFY':
        return (
          <OtpVerificationScreen 
            mobile={mobile} 
            onVerified={(token, isNewUser) => {
              setToken(token);
              if (isNewUser) setStep('ACCOUNT_DETAILS');
              else setStep('PLAN_SELECTION');
            }} 
          />
        );
      case 'ACCOUNT_DETAILS':
        return <AccountDetailsScreen token={token!} onNext={() => setStep('PLAN_SELECTION')} />;
      case 'PLAN_SELECTION':
        return <PlanSelectionScreen token={token!} onPaymentSuccess={(details) => {
          setMembershipDetails(details);
          setStep('PAYMENT_SUCCESS');
        }} />;
      case 'PAYMENT_SUCCESS':
        return <PaymentSuccessScreen details={membershipDetails} onNext={() => setStep('DASHBOARD')} />;
      case 'DASHBOARD':
        return <MembershipDashboard token={token!} onLogout={() => {
          setToken(null);
          setStep('LANDING');
        }} />;
      default:
        return <LandingScreen onNext={() => setStep('MOBILE_INPUT')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <ErrorBoundary>
        {renderStep()}
      </ErrorBoundary>
    </div>
  );
}
