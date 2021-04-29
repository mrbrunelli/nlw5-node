import { getCustomRepository, Repository } from "typeorm";
import { Connection } from "../entities/Connection";
import { ConnectionsRepository } from "../repositories/ConnectionsRepository";

interface IConnectionCreate {
  socket_id: string;
  user_id: string;
  admin_id?: string;
  id?: string;
}

export class ConnectionsService {
  private connectionsService: Repository<Connection>;

  constructor() {
    this.connectionsService = getCustomRepository(ConnectionsRepository);
  }

  async create({ admin_id, socket_id, user_id, id }: IConnectionCreate) {
    const connection = this.connectionsService.create({
      socket_id,
      user_id,
      admin_id,
      id
    });
    await this.connectionsService.save(connection);
    return connection;
  }

  async findByUserId(user_id: string) {
    const connection = await this.connectionsService.findOne({ user_id });
    return connection;
  }
}