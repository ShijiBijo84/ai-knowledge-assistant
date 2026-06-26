import { EllipsisOutlined } from '@ant-design/icons'

type Props = {
    className?: string;
}

export default function EllipsisIcon({ className }: Props) {
    return <EllipsisOutlined className={className} />
}