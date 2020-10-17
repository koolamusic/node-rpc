import { toPromise } from './../shared/utils';
import { TodoService } from './todo.service';
import { TodoListDto, TodoDto } from './todo.dto';
import { Controller, Get, Param, Req } from '@nestjs/common';
toPromise;
TodoDto;

@Controller('api/todos')
export class TodoController {
	/** 1 */ constructor(private readonly todoService: TodoService) {}
	@Get() /** 2 */
	async findAll(): Promise<TodoListDto> {
		/** 3 */ const todos = await this.todoService.getAllTodo();
		/** 4 */ return toPromise({ todos });
	}
	/** 5 */

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<TodoDto> {
		return await this.todoService.getOneTodo(id);
	}
	/** 6 */

	// @Post() async; /** 7 */
	// create(@Body() todoCreateDto: TodoCreateDto): Promise<TodoDto> {
	// 	return await this.todoService.createTodo(todoCreateDto);
	// }
	// @Put(':id')
	// async /** 8 */
	// update(@Param('id') id: string, @Body() todoDto: TodoDto): Promise<TodoDto> {
	// 	return await this.todoService.updateTodo(todoDto);
	// }
	// @Delete(':id')
	// async destory(@Param('id') id: string): Promise<TodoDto> {
	// 	return await this.todoService.destoryTodo(id);
	// }
}
