import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import Menu_class from "../UI/MenuBar.module.css";

const menuItems = [
  { name: "Compose", path: "/UserProfile/compose" },
  { name: "Inbox", path: "/UserProfile/inbox" },
  { name: "Unread", path: "/UserProfile/unread" },
  { name: "Starred", path: "/UserProfile/starred" },
  { name: "Drafts", path: "/UserProfile/drafts" },
  { name: "Sent", path: "/UserProfile/sent" },
  { name: "Archive", path: "/UserProfile/archive" },
  { name: "Spam", path: "/UserProfile/spam" },
  { name: "Deleted Items", path: "/UserProfile/deleteditems" },
];

const MenuBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unreadCount = useSelector((state) => state.email.unreadCount);

  return (
    <div className={Menu_class.sidebar}>
      {menuItems.map((item) => (
        <button
          key={item.name}
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
      ))}
    </div>
  );
};

export default MenuBar;
