import amqplib from "amqplib";
import "dotenv/config";
import pg from "pg";
import MailSender from "./services/MailSender.js";

const { Pool } = pg;

const init = async () => {
  const mailSender = new MailSender();
  const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    port: 5432, // Sesuaikan jika port beda
  });

  const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
  const channel = await connection.createChannel();

  const queue = "export:playlists";
  await channel.assertQueue(queue, {
    durable: true,
  });

  console.log(`[Consumer] Menunggu pesan di queue: ${queue}`);

  channel.consume(
    queue,
    async (message) => {
      if (message.content) {
        try {
          const { playlistId, targetEmail } = JSON.parse(
            message.content.toString()
          );
          console.log(
            `[Consumer] Menerima permintaan ekspor untuk playlist ${playlistId} ke ${targetEmail}`
          );

          // 1. Ambil detail playlist
          const playlistRes = await pool.query(
            "SELECT id, name FROM playlists WHERE id = $1",
            [playlistId]
          );
          const playlist = playlistRes.rows[0];

          // 2. Ambil lagu-lagu di playlist
          const songsRes = await pool.query(
            `SELECT s.id, s.title, s.performer
             FROM playlist_songs ps
             JOIN songs s ON ps.song_id = s.id
             WHERE ps.playlist_id = $1`,
            [playlistId]
          );
          const songs = songsRes.rows;

          // 3. Format data
          const exportData = {
            playlist: {
              ...playlist,
              songs: songs,
            },
          };

          // 4. Kirim email
          await mailSender.sendEmail(
            targetEmail,
            JSON.stringify(exportData, null, 2)
          );
          console.log(
            `[Consumer] Email berhasil dikirim ke ${targetEmail} untuk playlist ${playlistId}`
          );

          // 5. Acknowledge pesan
          channel.ack(message);
        } catch (error) {
          console.error(`[Consumer] Gagal memproses pesan: ${error.message}`);
          // Jika gagal, jangan ack agar bisa di-retry (tergantung strategi)
          // channel.nack(message, false, false); // Kirim ke dead-letter queue jika ada
          channel.ack(message); // Ack agar tidak looping error
        }
      }
    },
    { noAck: false } // Pastikan noAck: false
  );
};

init().catch(console.error);
