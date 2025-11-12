import { createClient } from "redis";
import "dotenv/config";

class CacheService {
  constructor() {
    this._client = createClient({
      url: process.env.REDIS_SERVER,
    });

    this._client.on("error", (error) => {
      console.error("[Redis]", error);
    });

    // Mulai koneksi di constructor
    if (!this._client.isOpen) {
      this._client.connect().catch((err) => {
        console.error(`[Redis] Gagal koneksi: ${err.message}`);
      });
    }
  }

  async set(key, value, expirationInSeconds = 1800) {
    // 1800 detik = 30 menit
    try {
      await this._client.set(key, value, {
        EX: expirationInSeconds,
      });
    } catch (err) {
      console.error(`[Redis] Gagal set cache: ${err.message}`);
    }
  }

  async get(key) {
    try {
      const result = await this._client.get(key);
      if (result === null) return null;
      return result;
    } catch (err) {
      console.error(`[Redis] Gagal get cache: ${err.message}`);
      return null;
    }
  }

  async del(key) {
    try {
      return await this._client.del(key);
    } catch (err) {
      console.error(`[Redis] Gagal delete cache: ${err.message}`);
      return 0;
    }
  }
}

export default CacheService;
