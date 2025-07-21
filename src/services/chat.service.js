import db from "../database/db.js";

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
    this.sent_user_id = sent_user_id;
    this.chat_room_id = chat_room_id;
    this.text = text || null;
    this.media = media || null;
    this.createdAt = new Date().toISOString();
    this.delivered_to = delivered_to;
    (this.read_by = read_by), (this.reaction = reaction);
  }

 static saveMessage() {
    const query = `
    INSERT INTO chat_message (
      text, media, sent_user_id, chat_room_id, created_at, delivered_to, read_by, reaction
    ) VALUES ($1, $2, $3, $4, NOW(), $5, $6, $7)
    RETURNING *;
  `;

    const values = [
      this.text,
      this.media,
      this.sent_user_id,
      this.chat_room_id,
      JSON.stringify(this.delivered_to ?? []),
      JSON.stringify(this.read_by ?? []),
      JSON.stringify(this.reaction ?? {}),
    ];

    console.log("Inserting chat message with values:", values);

    try {
      const { rows } = await db.query(query, values);
      if (!rows || rows.length === 0) {
        throw new Error("Failed to insert chat message");
      }
      return rows[0];
    } catch (error) {
      console.error("Error saving chat message:", error.message);
      throw new Error("Failed to insert chat message");
    }
  }

  static async getMessagesForRoom(chat_room_id) {
    const query = `
    SELECT * FROM chat_message
    WHERE chat_room_id = $1
    ORDER BY created_at ASC;
  `;
    const values = [chat_room_id];
    const { rows } = await db.query(query, values);
    return rows;
  }
}
