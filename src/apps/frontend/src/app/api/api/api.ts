export * from './tasks.service';
import { TasksService } from './tasks.service';
export * from './users.service';
import { UsersService } from './users.service';
export const APIS = [TasksService, UsersService];
