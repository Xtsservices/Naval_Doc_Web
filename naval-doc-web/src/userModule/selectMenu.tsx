import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UserHeader from "./userComponents/UserHeader";
import { BASE_URL } from "../constants/api";


// Sample icons as SVGs (replace with your own or use a library)
const WalletIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <rect
      x="3"
      y="7"
      width="18"
      height="10"
      rx="2"
      stroke="#fff"
      strokeWidth="2"
    />
    <circle cx="17" cy="12" r="1" fill="#fff" />
  </svg>
);

const UserIcon = () => (
  <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2" />
    <path
      d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
      stroke="#fff"
      strokeWidth="2"
    />
  </svg>
);

const SearchIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7" stroke="#888" strokeWidth="2" />
    <path d="M20 20l-3-3" stroke="#888" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const MicIcon = () => (
  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
    <rect
      x="9"
      y="4"
      width="6"
      height="12"
      rx="3"
      stroke="#888"
      strokeWidth="2"
    />
    <path d="M5 11v1a7 7 0 0 0 14 0v-1" stroke="#888" strokeWidth="2" />
    <path d="M12 19v3" stroke="#888" strokeWidth="2" />
  </svg>
);

const mealImages: Record<string, string> = {
  Breakfast: "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=200&q=80", // Indian breakfast (paratha, aloo)
  Lunch: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=200&q=80", // Indian lunch (biryani)
  Snack: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=200&q=80", // Indian snacks (samosa, pakora)
};

type MenuItem = {
  id: number;
  name: string;
  startTime: number;
  endTime: number;
  menuConfiguration: {
    id: number;
    name: string;
    defaultStartTime: number;
    defaultEndTime: number;
    formattedDefaultEndTime: string;
  };
};

type MenuData = Record<string, Record<string, MenuItem[]>>;

const SelectMenu: React.FC = () => {
  const [menus, setMenus] = useState<MenuData>({});
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const fetchMenus = async () => {
      setLoading(true);
      const canteenId = localStorage.getItem("canteenId");
      const token = localStorage.getItem("Token");
      console.log("Canteen ID:", canteenId);
      try {
        const res = await axios.get(
          `${BASE_URL}/menu/getMenusForNextTwoDaysGroupedByDateAndConfiguration?canteenId=${canteenId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("menu item data", res);
        setMenus(res.data.data || {});
      } catch (e) {
        setMenus({});
      }
      setLoading(false);
    };
    fetchMenus();
  }, []);

  return (
    <div
      style={{
        background: "#F8F9FB",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <UserHeader headerText={"Welfare Canteen"}/>

      {/* Search Bar */}
      <div
        style={{
          margin: "18px 16px 0 16px",
          display: "flex",
          alignItems: "center",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
          padding: "0 12px",
          height: 48,
        }}
      >
        <SearchIcon />
        <input
          type="text"
          placeholder="Search"
          style={{
            border: "none",
            outline: "none",
            flex: 1,
            marginLeft: 8,
            fontSize: 16,
            background: "transparent",
          }}
        />
        <MicIcon />
      </div>

      {/* Menu List */}
      <div style={{ margin: "18px 0 0 0" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 40, color: "#888" }}>
            Loading...
          </div>
        ) : (
          Object.keys(menus).map((date) => (
            <div
              key={date}
              style={{
                margin: "0 16px 18px 16px",
                background: "#fff",
                borderRadius: 18,
                boxShadow: "0 2px 8px #0001",
                padding: "18px 0 18px 0",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#0026A7",
                  marginLeft: 18,
                  marginBottom: 10,
                }}

              >
                {date}
              </div>
              <div style={{ display: "flex", gap: 18, padding: "0 18px" }}>
                {Object.keys(menus[date] || {}).length === 0 ? (
                  <div style={{ color: "#888", fontSize: 16 }}>
                    No menu available
                  </div>
                ) : (
                  Object.entries(menus[date]).map((menuItem) => {
                    const meal = menuItem[0];
                    const mealID = menuItem[1];
                    console.log(`Selected mealID===: mealID`, mealID);

                    return (
                      <div
                        key={meal}
                        style={{
                          width: 100,
                          background: "#F8F9FB",
                          borderRadius: 14,
                          boxShadow: "0 1px 4px #0001",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "10px 0 8px 0",
                          cursor: "pointer",
                          transition: "box-shadow 0.2s",
                        }}
                        onClick={() => {
                          localStorage.setItem("selectedDate", date);
                          navigate(`/user/selected-menu/${mealID[0].id}`);;
                        }}
                      >
                        <img
                          src={mealImages[meal] || mealImages.Breakfast}
                          alt={meal}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 10,
                            objectFit: "cover",
                            marginBottom: 8,
                          }}
                        />
                        <span
                          style={{
                            color: "#0026A7",
                            fontWeight: 600,
                            fontSize: 16,
                          }}
                        >
                          {meal}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectMenu;
