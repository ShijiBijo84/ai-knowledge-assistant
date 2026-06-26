import { useChatStore } from "../../store/chatStore";
import Button from "./common/Button";
import type { MenuProps } from 'antd';
import DropDown from "./common/DropDown";
import EllipsisIcon from "../icons/EllipsisIcon";


export function Sidebar() {
    const chats = useChatStore((s) => s.chats);
    const activeChatId = useChatStore((s) => s.activeChatId);
    const createChat = useChatStore((s) => s.createChat);
    const setActiveChatId = useChatStore((s) => s.setActiveChatId);
    const deleteChat = useChatStore((s) => s.deleteChat);

    const getMenuItems = (chatId: string): MenuProps['items'] => {
        return [
            {
                key: 'delete',
                label: 'Delete Chat',
                danger: true,
                onClick: () => deleteChat(chatId),
            },
        ];
    }
    return (
        <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col">
            <div className="p-4 border-b border-zinc-800 font-semibold text-sm tracking-wide text-zinc-200">
                Recipe AI
            </div>

            <div className="p-3">
                <button
                    type="button"
                    onClick={createChat}
                    className="w-full rounded-lg bg-zinc-800 hover:bg-zinc-700 active:scale-[0.98] transition p-3 text-left text-sm font-medium text-zinc-100"
                >
                    + New Chat
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        className={`
                            flex items-center justify-between
                            w-full rounded-lg px-3 py-2 text-sm transition cursor-pointer group
                          
                            ${activeChatId === chat.id
                                ? "bg-zinc-700 text-white"
                                : "text-zinc-300 hover:bg-zinc-800 hover:text-white"}
                          `}
                        onClick={() => setActiveChatId(chat.id)}
                    >
                        <span className="truncate">{chat.title}</span>

                        <DropDown
                            menu={{ items: getMenuItems(chat.id) }}
                            trigger={["click"]}
                            placement="bottomRight"
                        >
                            <Button
                                onClick={(e) => e.stopPropagation()}
                                className="
                                    opacity-0 group-hover:opacity-100
                                     text-zinc-400 hover:text-zinc-200
                                     hover:bg-zinc-700 transition
                                        p-1 rounded-md"
                            >
                                <EllipsisIcon />
                            </Button>
                        </DropDown>
                    </div>
                ))}
            </div>
        </div>
    )
}
