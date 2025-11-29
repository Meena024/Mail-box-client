import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Menu_class from "../UI/MenuBar.module.css";
import { useState } from "react";

const menuItems = [
  { name: "Compose", path: "/UserProfile/Compose" },
  { name: "Inbox", path: "/UserProfile/Inbox" },
  { name: "Unread", path: "/UserProfile/Unread" },
  {
    name: "Starred",
    sub: [
      { name: "Inbox", path: "/UserProfile/starred/Inbox" },
      { name: "Sent", path: "/UserProfile/starred/Sent" },
    ],
  },
  { name: "Drafts", path: "/UserProfile/Drafts" },
  { name: "Sent", path: "/UserProfile/Sent" },
  { name: "Archive", path: "/UserProfile/Archive" },
  { name: "Spam", path: "/UserProfile/Spam" },
  { name: "Deleted Items", path: "/UserProfile/DeletedItems" },
];

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useSelector((state) => state.email.unreadCount);
  const [expandStarred, setExpandStarred] = useState(false);

  return (
    <div className={Menu_class.sidebar}>
      {menuItems.map((item) => (
        <div key={item.name}>
          {!item.sub && (
            <button
              className={`${Menu_class.menuItem} ${
                location.pathname.includes(item.path) ? Menu_class.active : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.name}
              {item.name === "Inbox" && unreadCount > 0 && (
                <span className={Menu_class.badge}>{unreadCount}</span>
              )}
            </button>
          )}

          {item.sub && (
            <>
              <button
                className={Menu_class.menuItem}
                onClick={() => setExpandStarred(!expandStarred)}
              >
                Starred
                <span className={Menu_class.arrow}>
                  {expandStarred ? "▾" : "▸"}
                </span>
              </button>

              {expandStarred && (
                <div className={Menu_class.subMenu}>
                  {item.sub.map((sub) => (
                    <button
                      key={sub.name}
                      className={`${Menu_class.subItem} ${
                        location.pathname.includes(sub.path)
                          ? Menu_class.activeSub
                          : ""
                      }`}
                      onClick={() => navigate(sub.path)}
                    >
                      {sub.name}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default MenuBar;
