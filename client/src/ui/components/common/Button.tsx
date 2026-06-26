import { Button as AntdButton } from 'antd'
import type { ButtonProps } from 'antd'
const Button = ({ ...props }: ButtonProps) => {
    return <AntdButton {...props} />
}
export default Button