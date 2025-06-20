import styled from "styled-components";
import image from "../images/aboutus1.png";
import { useNavigate } from "react-router-dom";

const About = styled.section`
  margin-top: -80px;
  padding: 5rem 1rem;
  background-color: white;
`;

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  display: grid;
  gap: 3rem;
  grid-template-columns: 1fr;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AboutText = styled.div`
  h3 {
    color: #010080;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  p {
    color: #374151;
    margin-bottom: 1.5rem;
  }
`;

const AboutImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

const CtaButton = styled.button`
  background-color: #010080;
  color: white;
  padding: 0.5rem 1.5rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;

  &:hover {
    background-color: #010080;
  }
`;

export default function AboutSection() {
  const navigate = useNavigate();

  return (
    <section id="about">
      <div id="about">
        <About>
          <AboutContainer>
            <AboutText>
              <h3>About Us</h3>
              <h2>No Profit – No Loss</h2>
              <p>
                Welfare Canteens of Welfare Visakhapatnam caters
                breakfast, snacks, lunch for all employees on daily
                basis as per factories act 1948.
              </p>
              <p>
                Operated on a No Profit – No Loss basis, these canteens are
                committed to serving wholesome, hygienic, and tasty food. With a
                team of experienced cooking staff and a focus on maintaining
                quality stock, the canteens consistently strive to ensure high
                standards of food and service.
              </p>
              <CtaButton onClick={() => navigate("/About us")}>
                View More
              </CtaButton>
            </AboutText>
            <div>
              <AboutImg src={image} alt="About Us" />
            </div>
          </AboutContainer>
        </About>
      </div>
    </section>
  );
}
