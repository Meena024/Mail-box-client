import { Button, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const menuItems = [
  "Compose",
  "Inbox",
  "Unread",
  "Starred",
  "Drafts",
  "Sent",
  "Archive",
  "Spam",
  "Deleted Items",
];

const MenuBar = () => {
  const navigate = useNavigate();
  const unreadCount = useSelector((state) => state.email.unreadCount);

  const handleClick = (item) => {
    if (item === "Compose") navigate("/UserProfile/compose");
    if (item === "Inbox") navigate("/UserProfile/inbox");
    if (item === "Sent") navigate("/UserProfile/sent");
  };

  return (
    <Col className="flex flex-col gap-3 p-4 bg-gray-100 h-full rounded-2xl shadow-md">
      {menuItems.map((item) => (
        <Row key={item}>
          <Button className="m-2" onClick={() => handleClick(item)}>
            {item}
            {item === "Inbox" && unreadCount > 0 && (
              <span className="badge">{unreadCount}</span>
            )}
          </Button>
        </Row>
      ))}
    </Col>
  );
};

export default MenuBar;
