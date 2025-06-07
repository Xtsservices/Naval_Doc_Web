import React, { useEffect, useState } from "react";

interface MenuItem {
    _id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

const getMenuId = () => localStorage.getItem("menuId") || "";

const fetchMenuItems = async (menuId: string): Promise<MenuItem[]> => {
    const res = await fetch(`http://192.168.1.24:3002/api/menu/getMenuById?id=${menuId}`);
    const data = await res.json();
    // Adjust this mapping based on your API response structure
    return data.items || [];
};

const getSelectedItems = (): string[] => {
    // Assuming selected item IDs are stored as an array in localStorage
    return JSON.parse(localStorage.getItem("selectedItems") || "[]");
};

const MenuByItems: React.FC = () => {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    useEffect(() => {
        const menuId = getMenuId();
        fetchMenuItems(menuId).then(setItems);
        setSelectedItems(getSelectedItems());
    }, []);

    // Filter only selected items
    const filteredItems = items.filter(item => selectedItems.includes(item._id));

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.title}>Breakfast</h2>
            </header>
            <div>
                {filteredItems.map(item => (
                    <div key={item._id} style={styles.card}>
                        <img src={item.image} alt={item.name} style={styles.image} />
                        <div style={styles.info}>
                            <div style={styles.row}>
                                <span style={styles.name}>{item.name}</span>
                                <span style={styles.price}>₹{item.price}</span>
                            </div>
                            <div style={styles.desc}>{item.description}</div>
                            <button style={styles.addBtn} disabled>
                                ADDED
                            </button>
                        </div>
                    </div>
                ))}
                {filteredItems.length === 0 && (
                    <div style={{ textAlign: "center", marginTop: 40 }}>No items selected.</div>
                )}
            </div>
            {/* Add your bottom navigation here if needed */}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: "16px 0",
        background: "#f7f8fa",
        minHeight: "100vh",
        fontFamily: "sans-serif",
    },
    header: {
        background: "#071ea0",
        color: "#fff",
        padding: "24px 16px 16px 16px",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginBottom: 16,
    },
    title: {
        margin: 0,
        fontSize: 28,
        fontWeight: 700,
    },
    card: {
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 8px #0001",
        display: "flex",
        alignItems: "flex-start",
        padding: 16,
        margin: "12px 16px",
        gap: 16,
    },
    image: {
        width: 70,
        height: 70,
        borderRadius: 12,
        objectFit: "cover",
    },
    info: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    row: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontWeight: 600,
        fontSize: 18,
    },
    price: {
        color: "#071ea0",
        fontWeight: 700,
        fontSize: 18,
    },
    desc: {
        color: "#555",
        fontSize: 14,
        marginBottom: 8,
    },
    addBtn: {
        background: "#071ea0",
        color: "#fff",
        border: "none",
        borderRadius: 22,
        padding: "8px 32px",
        fontWeight: 600,
        fontSize: 16,
        alignSelf: "flex-start",
        marginTop: 4,
        cursor: "not-allowed",
        opacity: 0.7,
    },
};

export default MenuByItems;