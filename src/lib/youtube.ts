export function getYoutubeVideoId(url: string): string {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    const parts = url.split("?");
    if (parts.length > 1) {
      videoId = new URLSearchParams(parts[1]).get("v") || "";
    }
  } else if (url.includes("youtube.com/embed/")) {
    videoId = url.split("youtube.com/embed/")[1]?.split("?")[0];
  }
  return videoId;
}

export function getYoutubeEmbedUrl(url: string): string {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&controls=1&rel=0` : url;
}

export function getYoutubeThumbnailUrl(url: string): string | null {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
}
