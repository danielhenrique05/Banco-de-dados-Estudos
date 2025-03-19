const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/AppError");
const sqliteconection = require("../database/sqlite");

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body;

    const database = await sqliteconection();
    const checkUserExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (checkUserExists) {
      throw new AppError("este email já está em uso.");
    }

    const hashedPassword = await hash(password, 8);

    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return response.status(201).json();
  }

  async update(request, response) {
    const { name, email, password, old_passoword } = request.body;
    const { id } = request.params;

    const database = await sqliteconection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

    if (!user) {
      throw new AppError("Usuario nao encontrado");
    }

    const userWithUpadteEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      email
    );

    if (userWithUpadteEmail && userWithUpadteEmail.id !== user.id) {
      throw new AppError("esse email já está em uso");
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_passoword) {
      throw new AppError("voce deve informar a senha antiga para atualizar");
    }

    if (password && old_passoword) {
      const checkOldPassword = await compare(old_passoword, user.password);
      if (!checkOldPassword) {
        throw new AppError("A senha antiga nao confere");
      }

      user.password = await hash(password, 8);
    }

    await database.run(
      `
      UPDATE users SET 
      name = ?, 
      email = ?, 
      password = ?,
      update_at = DATETIME('now'),
      WHERE id= ?`,
      [user.name, user.email, user.password, id]
    );

    return response.json();
  }
}

module.exports = UserController;
