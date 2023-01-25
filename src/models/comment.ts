import client from "../data/connections/database.config";

export class Comment {
  static async getComments(limit: number, offset: number) {
    const result = await client.query(
      `
            SELECT * FROM comments WHERE status = 'aprovado' LIMIT ${limit} OFFSET ${offset}
            `
    );
    return result.rows;
  }

  static async createComment(name: string, comment: string) {
    const sql = "INSERT INTO comments (name, comment) VALUES ($1, $2)";
    const values = [name, comment];
    await client.query(sql, values);
    return { message: "Comentario criado com sucesso!" };
  }

  static async setApproved(commentId: number) {
    const result = await client.query(
      `SELECT status FROM comments WHERE id = ${commentId}`
    );

    if (result.rows[0].status === "pendente") {
      await client.query(
        `UPDATE comments SET status = 'aprovado' WHERE id = ${commentId}`
      );
      return "Comentario foi aprovado com sucesso!";
    } else {
      throw new Error("Comentario ja foi aprovado ou rejeitado");
    }
  }

  static async setRejected(commentId: number) {
    const result = await client.query(
      `SELECT status FROM comments WHERE id = ${commentId}`
    );
    if (result.rows[0].status === "pendente") {
      await client.query(
        `UPDATE comments SET status = 'rejected' WHERE id = ${commentId}`
      );
      return "Comentario foi rejeitado com sucesso";
    } else {
      throw new Error("Comentario ja foi aprovado ou rejeitado");
    }
  }
}
