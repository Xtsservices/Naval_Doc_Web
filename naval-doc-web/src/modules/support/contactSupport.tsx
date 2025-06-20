import React from 'react';
import UserHeader from '../../userModule/userComponents/UserHeader';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AppState } from '../../store/storeTypes';
import {toast } from 'react-toastify'; // ✅ ADD
import 'react-toastify/dist/ReactToastify.css'; // ✅ ADD


const API_URL = 'https://iqtelephony.airtel.in/gateway/airtel-xchange/v2/execute/workflow';
const COLORS = {
  CARD_1: '#e6f0ff',
  CARD_2: '#fff2cc',
  CARD_3: '#e6ffec',
};

type CallOption = 1 | 2 | 3;

const CallCenter: React.FC = () => {
  const location = useLocation();

  // 🔗 Get mobile from Redux state
  const phoneNumber = useSelector((state: AppState) => state.currentUserData?.mobile || '');

  const handleApiCall = async (option: CallOption) => {
    try {
      if (!phoneNumber) {
        alert('No phone number found. Please login or update your profile.');
        return;
      }

      const payload = {
        callFlowId:
          'TUMspyjWoYb+Ul8vp2khpgWZix3lECvaXcJtTQ78KKK6ZrDHJu7L4PH+3GpdB3h+NZote2LjQdUQy1S9rnLnpLO4EZ0yMMDdK9TZynTxHEU=',
        customerId: 'KWIKTSP_CO_Td9yLftfU903GrIZNyxW',
        callType: 'OUTBOUND',
        callFlowConfiguration: {
          initiateCall_1: {
            callerId: '8048248411',
            mergingStrategy: 'SEQUENTIAL',
            participants: [
              {
                participantAddress: phoneNumber,
                callerId: '8048248411',
                participantName: 'abc',
                maxRetries: 1,
                maxTime: 360,
              },
            ],
            maxTime: 360,
          },
          addParticipant_1: {
            mergingStrategy: 'SEQUENTIAL',
            maxTime: 360,
            participants: [
              {
                participantAddress:
                  option === 1 ? '9494999989' : option === 2 ? '7093081518' : '9052519059',
                participantName: 'pqr',
                maxRetries: 1,
                maxTime: 360,
              },
            ],
          },
        },
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          Authorization: 'Basic c21hcnRlcmJpejotaDcySj92MnZUWEsyV1J4',
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('API call failed');
      await response.json();

       // ✅ Replaced alert with toast
      toast.success('Call Initiated. Please wait for the call to connect.');
      
      // alert('Call Initiated. Please wait for the call to connect.');
    } catch (error) {
      toast.error('Call Initiated. error.');
      // alert('Failed to initiate call');
      console.error('API call error:', error);
    }
  };

  // Styles (same as before)
  const containerStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    border: '2px solid #0033a0',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '90%',
    width: '500px',
    marginTop: '24px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  };

  const cardTitleStyle: React.CSSProperties = {
    textAlign: 'center',
    fontSize: '20px',
    color: '#0033a0',
    fontWeight: 'bold',
    marginBottom: '24px',
  };

  const optionBoxStyle = (bgColor: string): React.CSSProperties => ({
    backgroundColor: bgColor,
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  });

  const textWrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
  };

  const optionTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#0033a0',
    marginBottom: '4px',
  };

  const optionSubtitleStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#333',
    margin: 0,
  };

  const callIconStyle: React.CSSProperties = {
    fontSize: '22px',
    // color: '#0033a0',
    color: '#28a745',
  };

  return (
    <div style={containerStyle}>
      {location.pathname.includes('/user/contact-support') && (
        <UserHeader headerText="Call Center" />
      )}

      <div style={cardStyle}>
        <div style={cardTitleStyle}>Call Options</div>

        <div style={optionBoxStyle(COLORS.CARD_1)} onClick={() => handleApiCall(1)}>
          <div style={textWrapperStyle}>
            <div style={optionTitleStyle}>Call Option 1</div>
            <p style={optionSubtitleStyle}>Customer Support</p>
          </div>
          <span style={callIconStyle}>📞</span>
        </div>

        <div style={optionBoxStyle(COLORS.CARD_2)} onClick={() => handleApiCall(2)}>
          <div style={textWrapperStyle}>
            <div style={optionTitleStyle}>Call Option 2</div>
            <p style={optionSubtitleStyle}>Technical Support</p>
          </div>
          <span style={callIconStyle}>📞</span>
        </div>

        <div style={optionBoxStyle(COLORS.CARD_3)} onClick={() => handleApiCall(3)}>
          <div style={textWrapperStyle}>
            <div style={optionTitleStyle}>Call Option 3</div>
            <p style={optionSubtitleStyle}>General Inquiry</p>
          </div>
          <span style={callIconStyle}>📞</span>
        </div>
      </div>
    </div>
  );
};

export default CallCenter;
