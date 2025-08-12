"use client";

interface AvatarProps {
  userName?: string;
}

export function Avatar({ userName }: AvatarProps) {
  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "";

    const nameParts = name
      .trim()
      .split(" ")
      .filter((part) => part.length > 0);

    if (nameParts.length === 0) return "";

    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${
        nameParts[nameParts.length - 1][0]
      }`.toUpperCase();
    }

    if (nameParts[0].length > 1) {
      return `${nameParts[0][0]}${nameParts[0][1]}`.toUpperCase();
    }

    return nameParts[0][0].toUpperCase();
  };

  const getColorFromName = (name: string) => {
    if (!name) return "#6366F1";

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ("00" + value.toString(16)).substr(-2);
    }

    return color;
  };

  const avatarStyle = {
    backgroundColor: getColorFromName(userName || ""),
  };

  return (
    <div
      className="flex h-10 w-10 items-center justify-center rounded-full"
      style={avatarStyle}
    >
      <span className="text-sm font-semibold text-white">
        {userName && getInitials(userName)}
      </span>
    </div>
  );
}
