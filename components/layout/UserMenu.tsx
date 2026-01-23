/**
 * User Menu Component
 * 
 * Wireframe: task-0.5.1.15-header-component.md
 * Part of: Header component
 * Implements: User menu dropdown with Profile, Settings, Logout
 * Wireframe Link: ../../docs/04-design/user-experience/wireframes/00-core-foundation/layout-navigation/task-0.5.1.15-header-component.md
 * 
 * Database: users table (id, email, full_name, avatar_url, role)
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";

interface UserMenuProps {
  user: any;
  permissions: any;
  loading: boolean;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCloseNotifications: () => void;
}

export function UserMenu({
  user,
  permissions,
  loading,
  isOpen,
  onOpenChange,
  onCloseNotifications,
}: UserMenuProps) {
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [userData, setUserData] = useState<any>(null);

  // Get user data from users table
  useEffect(() => {
    if (!user) return;

    async function fetchUserData() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("users")
        .select("id, email, full_name, avatar_url, role")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setUserData(data);
      }
    }

    fetchUserData();
  }, [user]);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onOpenChange(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onOpenChange]);

  // Focus trap
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstButton = menuRef.current.querySelector("button");
      firstButton?.focus();
    }
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onOpenChange(false);
      buttonRef.current?.focus();
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const getInitials = () => {
    if (userData?.full_name) {
      const names = userData.full_name.split(" ");
      if (names.length >= 2) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (userData?.email) {
      return userData.email[0].toUpperCase();
    }
    return "U";
  };

  if (loading || !user) {
    return (
      <div className="w-10 h-10 rounded-full bg-bg-tertiary animate-pulse" />
    );
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => {
          onOpenChange(!isOpen);
          onCloseNotifications();
        }}
        className={cn(
          "flex items-center gap-2 px-1 py-1 rounded-md",
          "hover:bg-bg-secondary transition-colors duration-150",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        )}
        aria-label={`User menu${userData?.full_name ? ` for ${userData.full_name}` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center",
            "bg-primary-500 text-white text-sm font-semibold",
            "border-2 border-white"
          )}
        >
          {userData?.avatar_url ? (
            <img
              src={userData.avatar_url}
              alt={userData.full_name || "User"}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>{getInitials()}</span>
          )}
        </div>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={cn(
            "w-4 h-4 text-text-secondary transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={cn(
            "absolute top-full right-0 mt-2 w-50 bg-bg-primary",
            "border border-border-default rounded-md shadow-medium",
            "py-1 z-[1060]",
            "animate-in fade-in slide-in-from-top-1 duration-200"
          )}
          role="menu"
          onKeyDown={handleKeyDown}
        >
          <button
            onClick={() => {
              router.push("/dashboard/profile");
              onOpenChange(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-primary",
              "hover:bg-bg-secondary transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
            )}
            role="menuitem"
          >
            <User className="w-4 h-4 text-text-secondary" />
            Profile
          </button>

          <button
            onClick={() => {
              router.push("/dashboard/settings");
              onOpenChange(false);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-text-primary",
              "hover:bg-bg-secondary transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
            )}
            role="menuitem"
          >
            <Settings className="w-4 h-4 text-text-secondary" />
            Settings
          </button>

          <div className="h-px bg-border-default my-1" role="separator" />

          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-error-600",
              "hover:bg-bg-secondary hover:text-error-700 transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-error-500 focus:ring-inset"
            )}
            role="menuitem"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
