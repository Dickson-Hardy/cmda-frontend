import Modal from "~/components/Global/Modal/Modal";
const Drawer = ({ active, children, setActive, containerClassName }) => (
  <Modal
    isOpen={active}
    onClose={() => setActive(false)}
    title="Calendar"
    className={containerClassName}
    maxWidth={480}
  >
    {children}
  </Modal>
);
export default Drawer;
