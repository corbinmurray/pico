import LZString from "lz-string";

/**
 * Service for compressing and decompressing markdown content
 */
export interface ICompressionService {
  compress(text: string): string;
  decompress(compressed: string): string | null;
}

class CompressionService implements ICompressionService {
  /**
   * Compress text using LZ-based compression with URI encoding
   * @param text - The text to compress
   * @returns URI-encoded compressed string
   */
  compress(text: string): string {
    return LZString.compressToEncodedURIComponent(text);
  }

  /**
   * Decompress a previously compressed string with dual-format support
   * @param compressed - The compressed string to decompress
   * @returns The original text or null if decompression fails
   */
  decompress(compressed: string): string | null {
    // Try new URI-encoded format first
    let result = LZString.decompressFromEncodedURIComponent(compressed);

    // Fallback to legacy Base64 format for backward compatibility
    if (!result) {
      result = LZString.decompressFromBase64(compressed);
    }

    return result;
  }
}

export const compressionService = new CompressionService();
