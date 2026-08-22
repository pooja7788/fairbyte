import React from "react";
import { motion } from "motion/react";
import { Bell, X, Check, ShieldCheck, Tag, Clock, Bike } from "lucide-react";
import { AppNotification } from "../types";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export default function NotificationsModal({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification
}: NotificationsModalProps) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs" onClick={onClose} />
      
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-zinc-200 shadow-2xl z-50 flex flex-col h-full overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-zinc-950 text-base font-sans">
                Notifications
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">
                {unreadCount} unread updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="cursor-pointer text-[11px] font-bold text-emerald-700 hover:underline"
              >
                Mark all read
              </button>
            )}
            <button
              onClick={onClose}
              className="cursor-pointer p-1.5 rounded-full text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-grow overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="py-20 text-center text-zinc-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-zinc-300" />
              <p className="text-xs">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => onSelectNotification(notif)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all space-y-1 ${
                  notif.read
                    ? "bg-white border-zinc-200 text-zinc-700"
                    : "bg-emerald-50/50 border-emerald-300/80 text-zinc-900 shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {notif.type === "order" && <Bike className="w-4 h-4 text-emerald-600" />}
                    {notif.type === "offer" && <Tag className="w-4 h-4 text-amber-600" />}
                    {notif.type === "system" && <ShieldCheck className="w-4 h-4 text-teal-600" />}
                    <h4 className="font-extrabold text-xs text-zinc-950">{notif.title}</h4>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">{notif.timeAgo}</span>
                </div>

                <p className="text-xs text-zinc-600 leading-relaxed pl-6">
                  {notif.message}
                </p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </>
  );
}
