import styled from "styled-components";
import { Link, useLocation } from "react-router-dom";
import logo from "/public/Naval.jpg";

const HeaderWrapper = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background-color: #010080;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 300;

  @media (max-width: 600px) {
    flex-direction: column;
    padding: 0.5rem 0.5rem;
  }
`;

const LogoImage = styled.img`
  height: 56px;
  width: auto;
  cursor: pointer;

  @media (max-width: 600px) {
    height: 40px;
    margin-bottom: 0.3rem;
  }
`;

const CenterTitle = styled.h1`
  color: white;
  font-size: 1.25rem;
  margin: 0;
  flex: 1;
  text-align: center;
  font-weight: 600;
  letter-spacing: 1px;

  @media (max-width: 600px) {
    font-size: 1rem;
    margin-left: 0;
    margin-bottom: 0.3rem;
  }
`;

export default function Header() {
  const location = useLocation();

  const handleLogoClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <HeaderWrapper>
      <Link
        to="/"
        onClick={handleLogoClick}
        style={{ display: "flex", alignItems: "center" }}
      >
        <LogoImage src={logo} alt="Naval Logo" />
      </Link>
      <CenterTitle>WELFARE CANTEEN</CenterTitle>
      <Link to="/login" style={{ textDecoration: "none" }}>
        <button
          style={{
        background: "#fff",
        color: "#010080",
        border: "none",
        borderRadius: "4px",
        padding: "0.5rem 1.2rem",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "1rem",
        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        transition: "background 0.2s, color 0.2s"
          }}
        >
          Login
        </button>
      </Link>
    </HeaderWrapper>
  );
}
