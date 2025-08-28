export function FormatTimeAgo(timestamp) {
  const now = new Date();
  const time = new Date(timestamp);
  const diff = (now - time) / 1000; // in seconds

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min${Math.floor(diff / 60) > 1 ? 's' : ''} ago`;

  // Helper to format time as h:mm AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // Today
  if (
    time.getDate() === now.getDate() &&
    time.getMonth() === now.getMonth() &&
    time.getFullYear() === now.getFullYear()
  ) {
    return `Today at ${formatTime(time)}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (
    time.getDate() === yesterday.getDate() &&
    time.getMonth() === yesterday.getMonth() &&
    time.getFullYear() === yesterday.getFullYear()
  ) {
    return `Yesterday at ${formatTime(time)}`;
  }

  // Older: Jun 29, 2025 at 4:32 PM
  return `${time.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })} at ${formatTime(time)}`;
}