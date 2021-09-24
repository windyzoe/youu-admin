export function getDownloadURL(fileId) {
  return `/api/annex/download?fileId=${fileId}`;
}

export function startDownload(fileId) {
  window.open(`/api/annex/download?fileId=${fileId}`);
}

export function getUploadUrl() {
  return `/api/annex/upload`;
}
