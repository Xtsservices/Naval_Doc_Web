import React from 'react';
import UserHeader from '../../userModule/userComponents/UserHeader';
import { useLocation } from 'react-router-dom';


const CallCenter: React.FC = () => {
  const location = useLocation();
  const containerStyle: React.CSSProperties = {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    margin: 0,
    padding: '0',
    // minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  // const headerStyle: React.CSSProperties = {
  //   width: '100%',
  //   backgroundColor: '#0033a0',
  //   color: 'white',
  //   padding: '16px',
  //   textAlign: 'center',
  //   fontSize: '20px',
  //   fontWeight: 600,
  // };

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
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
  });

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

  return (
    <div style={containerStyle}>
      {/* Header
      <div style={headerStyle}>Call Center</div> */}
      {location.pathname.includes('/user/contact-support') && (
        <UserHeader headerText='Call Center' />
      )}

      {/* Call Options Card */}
      <div style={cardStyle}>
        <div style={cardTitleStyle}>Call Options</div>

        <div style={optionBoxStyle('#e6f0ff')}>
          <div style={optionTitleStyle}>Call Option 1</div>
          <p style={optionSubtitleStyle}>Customer Support</p>
        </div>

        <div style={optionBoxStyle('#fff2cc')}>
          <div style={optionTitleStyle}>Call Option 2</div>
          <p style={optionSubtitleStyle}>Technical Support</p>
        </div>

        <div style={optionBoxStyle('#e6ffec')}>
          <div style={optionTitleStyle}>Call Option 3</div>
          <p style={optionSubtitleStyle}>General Inquiry</p>
        </div>
      </div>
    </div>
  );
};

export default CallCenter;
