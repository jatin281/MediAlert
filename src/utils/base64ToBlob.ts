// utils/base64ToBlob.ts

export const base64ToBlob = (base64: string, contentType: string): Blob => {
    // Remove data URL prefix (if present)
    const base64WithoutPrefix = base64.replace(/^data:[a-z]+\/[a-z]+;base64,/, '');
  
    const byteCharacters = atob(base64WithoutPrefix); // Decode the base64 string
    const byteNumbers = new Array(byteCharacters.length)
      .fill(null)
      .map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  };