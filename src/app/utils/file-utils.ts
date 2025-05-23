export function dataURLtoFile(dataUrl: string): File {
  if (!dataUrl.includes(',')) {
    throw new Error('Invalid data URL format.');
  }

  const [metadata, base64Data] = dataUrl.split(',');
  const mimeMatch = metadata.match(/data:(.*?);base64/);

  if (!mimeMatch || !mimeMatch[1]) {
    throw new Error('Could not extract MIME type from data URL.');
  }

  const mimeType = mimeMatch[1];

  const extensionMap: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'application/pdf': 'pdf',
    'text/plain': 'txt',
    'text/csv': 'csv',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  };

  const fileExtension = extensionMap[mimeType] || 'bin';
  const byteString = atob(base64Data);
  const uint8Array = new Uint8Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }

  const fileName = `file.${fileExtension}`;

  return new File([uint8Array], fileName, { type: mimeType });
}
