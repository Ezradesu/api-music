import amqplib from "amqplib";
import "dotenv/config";

const ProducerService = {
  sendMessage: async (queue, message) => {
    try {
      const connection = await amqplib.connect(process.env.RABBITMQ_SERVER);
      const channel = await connection.createChannel();
      await channel.assertQueue(queue, {
        durable: true,
      });

      channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

      console.log(`[Producer] Pesan terkirim ke queue ${queue}: ${message}`);

      setTimeout(() => {
        connection.close();
      }, 1000);
    } catch (error) {
      console.error(
        `[Producer] Gagal mengirim pesan ke RabbitMQ: ${error.message}`
      );
    }
  },
};

export default ProducerService;
