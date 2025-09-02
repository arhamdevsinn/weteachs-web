export class UrlUtils {
  static addUserIdToUrl(url: string, userId: string): string {
    const urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    urlObj.searchParams.set('userId', userId);
    return urlObj.toString();
  }

  static removeUserIdFromUrl(url: string): string {
    const urlObj = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    urlObj.searchParams.delete('userId');
    return urlObj.toString();
  }

  static getUserIdFromUrl(url?: string): string | null {
    const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    if (!currentUrl) return null;
    
    try {
      const urlObj = new URL(currentUrl);
      return urlObj.searchParams.get('userId');
    } catch {
      return null;
    }
  }
}