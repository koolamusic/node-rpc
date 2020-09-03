import { toTodoDto } from './../shared/mapper';
import { toPromise } from './../shared/utils';
import { TodoDto, TodoCreateDto } from './todo.dto';
import { TodoEntity } from './todo.entity';
import { todos } from 'src/mock/todos.mock';
import * as uuid from 'uuid';
import { HttpException, Injectable, HttpStatus } from '@nestjs/common';

@Injectable()
export class TodoService {
	/** 1 */

	todos: TodoEntity[] = todos;

	async getAllTodo(): Promise<any> {
		return { todo: 'Find me', todos };
	}

	async getOneTodo(id: string): Promise<TodoDto> {
		/** 2 */

		const todo = this.todos.find((todo) => todo.id === id);
		if (!todo) {
			/** 3 */

			throw new HttpException(`Todo item doesn't exist`, HttpStatus.BAD_REQUEST);
		}
		/** 4 */

		return toPromise(toTodoDto(todo));
	}
	async createTodo(todoDto: TodoCreateDto): Promise<TodoDto> {
		const { name, description } = todoDto;
		const todo: TodoEntity = {
			id: Math.random().toString(),
			name,
			description
		};
		this.todos.push(todo);
		return toPromise(toTodoDto(todo));
	}
	// rest of the service has been removed for brevity
}
