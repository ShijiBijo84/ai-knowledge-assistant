import { Dropdown as AntdDropdown, type DropdownProps } from "antd";

const DropDown = ({ ...props }: DropdownProps) => {
    return <AntdDropdown {...props} />;
}
export default DropDown;