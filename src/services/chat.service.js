import db from "../database/db.js"; // Assumes db.js exports a valid pool/query client

export default class Chat {
  constructor({
    text,
    media,
    sent_user_id,
    chat_room_id,
    delivered_to,
    read_by,
    reaction,
  }) {
    this.text = text || null;
    this.media = media || null;
    this.sent_user_id = sent_user_id;
    this.chat_room_id = chat_room_id;
    this.createdAt = new Date().toISOString();

    // Ensure JSON-valid defaults
    this.delivered_to = Array.isArray(delivered_to) ? delivered_to : [];
    this.read_by = Array.isArray(read_by) ? read_by : [];
    this.reaction =
      reaction && typeof reaction === "object" && !Array.isArray(reaction)
        ? reaction
        : {};
  }

  async saveMessage() {
    const query = `
      INSERT INTO chat_message (
        text,
        media,
        sent_user_id,
        chat_room_id,
        created_at,
        delivered_to,
        read_by,
        reaction
      ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      this.text,
      this.media,
      this.sent_user_id,
      this.chat_room_id,
      JSON.stringify(this.delivered_to),
      JSON.stringify(this.read_by),
      JSON.stringify(this.reaction),
    ];

    console.log("Inserting chat message with values:", values);

    try {
      const result = await db.query(query, values);
      if (!result || result.length === 0) {
        throw new Error("No rows returned from insert");
      }
      return result[0];
    } catch (error) {
      console.error("Error saving chat message:", error);
      throw new Error("Failed to insert chat message");
    }
  }

  static async getMessagesForRoom(chat_room_id) {
    const query = `
      SELECT * FROM chat_message
      WHERE chat_room_id = $1
      ORDER BY created_at ASC;
    `;
    try {
      const result = await db.query(query, [chat_room_id]);
      return result;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw new Error("Failed to fetch messages for chat room");
    }
  }
}
