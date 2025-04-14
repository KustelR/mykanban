export default function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const locale = navigator.language;
  return date.toLocaleString(locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}
