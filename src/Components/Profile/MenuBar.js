import { MiscAction } from "../../Redux store/MiscSlice";
import { Button, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

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
  const dispatch = useDispatch();
  return (
    <Col className="flex flex-col gap-3 p-4 bg-gray-100 h-full rounded-2xl shadow-md">
      {menuItems.map((item) => (
        <Row>
          <Button
            key={item}
            className="m-2 text-lg font-medium cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-xl p-2 transition"
            onClick={() => dispatch(MiscAction.setRenderingComp(item))}
          >
            {item}
          </Button>
        </Row>
      ))}
    </Col>
  );
};

export default MenuBar;
