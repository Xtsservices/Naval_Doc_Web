import dayjs from "dayjs";

type LanguageTexts = {
  [key in "en" | "te"]: {
    login: string;
    mobileNumber: string;
    sendOtp: string;
    enterOtp: string;
    enterOtpPlaceholder: string;
    resendOtp: string;
    loginButton: string;
    invalidMobile: string;
    invalidOtp: string;
    enterMobileNumber: string;
    otpSentSuccess: string;
    failedToSendOtp: string;
    errorSendingOtp: string;
    invalidOtpOrVerificationFailed: string;
    verificationFailed: string;
    poweredBy: string;
    worldtek: string;
    languageLabel: string;
  };
};

export const languageTexts: LanguageTexts = {
  en: {
    login: "LOGIN",
    mobileNumber: "Enter your Mobile Number",
    sendOtp: "Request OTP",
    enterOtp: "Enter OTP",
    enterOtpPlaceholder: "Enter 6-digit OTP",
    resendOtp: "Resend OTP",
    loginButton: "Verify OTP",
    invalidMobile: "Please enter a valid 10-digit mobile number",
    invalidOtp: "Please enter a valid 6-digit OTP",
    enterMobileNumber: "Please enter your mobile number",
    otpSentSuccess: "OTP Sent Successfully",
    failedToSendOtp: "Failed to send OTP",
    errorSendingOtp: "Error sending OTP",
    invalidOtpOrVerificationFailed: "Invalid OTP or verification failed",
    verificationFailed: "Verification failed. Try again",
    poweredBy: "powered by",
    worldtek: "worldtek",
    languageLabel: "Language",
  },
  te: {
    login: "లాగిన్",
    mobileNumber: "మీ మొబైల్ నంబర్‌ని నమోదు చేయండి",
    sendOtp: "OTP అభ్యర్థించండి",
    enterOtp: "OTP నమోదు చేయండి",
    enterOtpPlaceholder: "6 అంకెల OTP నమోదు చేయండి",
    resendOtp: "OTP మళ్ళీ అభ్యర్థించండి",
    loginButton: "లాగిన్",
    invalidMobile:
      "దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబర్‌ని నమోదు చేయండి",
    invalidOtp: "దయచేసి చెల్లుబాటు అయ్యే 6 అంకెల OTPని నమోదు చేయండి",
    enterMobileNumber: "దయచేసి మీ మొబైల్ నంబర్‌ని నమోదు చేయండి",
    otpSentSuccess: "OTP విజయవంతంగా పంపబడింది",
    failedToSendOtp: "OTP పంపడం విఫలమైంది",
    errorSendingOtp: "OTP పంపడంలో లోపం",
    invalidOtpOrVerificationFailed: "చెల్లని OTP లేదా ధృవీకరణ విఫలమైంది",
    verificationFailed: "ధృవీకరణ విఫలమైంది. మళ్ళీ ప్రయత్నించండి",
    poweredBy: "ద్వారా",
    worldtek: "వరల్డ్టెక్",
    languageLabel: "భాష",
  },
};


export const formatUnixToISTDateTime = (unixTime: number | string): string => {
  if (!unixTime) return '-';

  const timestamp = typeof unixTime === 'string' ? parseInt(unixTime, 10) : unixTime;
  if (isNaN(timestamp)) return 'Invalid timestamp';

  const date = new Date(timestamp * 1000); // convert to ms
  return date.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

export const formatUnixToISTDate = (unixTime: number | string): string => {
  if (!unixTime) return '-';

  const timestamp = typeof unixTime === 'string' ? parseInt(unixTime, 10) : unixTime;
  if (isNaN(timestamp)) return 'Invalid timestamp';

  const date = new Date(timestamp * 1000); // convert to ms
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatUnixToISTTime = (unixTime: number | string): string => {
  if (!unixTime) return '-';

  const timestamp = typeof unixTime === 'string' ? parseInt(unixTime, 10) : unixTime;
  if (isNaN(timestamp)) return 'Invalid timestamp';

  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};