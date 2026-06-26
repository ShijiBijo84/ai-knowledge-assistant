import { useEffect } from "react";
import { useChatStore } from "../../store/chatStore";
import Button from "./common/Button";
import { EllipsisOutlined } from '@ant-design/icons';


export function Sidebar() {
    const chats = useChatStore((s) => s.chats);
    const activeChatId = useChatStore((s) => s.activeChatId);
    const createChat = useChatStore((s) => s.createChat);
    const setActiveChatId = useChatStore((s) => s.setActiveChatId);
    const openMenuId = useChatStore((s) => s.openMenuId);
    const setOpenMenuId = useChatStore((s) => s.setOpenMenuId);

    useEffect(() => {
        const handleMenu = () => {
            setOpenMenuId(null)
        }
        window.addEventListener("click", handleMenu);
        return () => window.removeEventListener("click", handleMenu)
    }, [setOpenMenuId])

    return (
        <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col ">
            <div className="p-4 border-b border-zinc-800 font-semibold text-sm tracking-wide text-zinc-200">
                Recipe AI
            </div>

            <div className="p-3">
                <button
                    type="button"
                    onClick={createChat}
                    className="
                    w-full rounded-lg
                    bg-zinc-800 hover:bg-zinc-700
                    active:scale-[0.98]
                    transition
                    p-3 text-left
                    text-sm font-medium
                  text-zinc-100
                 "
                >
                    + New Chat
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1" >
                {chats.map(chat => (
                    <div
                        key={chat.id}
                        className="relative"
                    >
                        <div
                            onClick={() => setActiveChatId(chat.id)}
                            className={`flex items-center justify-between
                             w-full rounded-lg px-3 py-2 text-sm transition
                            truncate cursor-pointer
                            ${activeChatId === chat.id
                                    ? "bg-zinc-700 text-white"
                                    : "text-zinc-300 hover:bg-zinc-800 hover:text-white"}`}
                        >
                            <span>{chat.title}</span>
                            <div className="hover: opacity-100">
                                <Button
                                    icon={<EllipsisOutlined />}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenMenuId(chat.id);
                                    }}
                                />
                            </div>
                        </div>

                        {openMenuId === chat.id && (
                            <div
                                className="absolute right-2 top-full mt-1 w-32 rounded-md bg-zinc-900 border border-zinc-700 shadow-lg z-50"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-zinc-800 text-red-400"
                                    onClick={() => console.log("delete", chat.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
