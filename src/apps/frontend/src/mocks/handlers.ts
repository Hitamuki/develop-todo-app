import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash-es';

const basePath = 'https://localhost:7268/api/v1';
const tasks = Array.from({ length: 10 }).map((_, index) => {
  return {
    id: faker.string.uuid(),
    title: `Title ${index + 1}`,
    description: faker.word.sample(),
    dueDate: faker.date.anytime().toUTCString(),
    statusId: sample([1, 2, 3])!,
    createdAt: faker.date.anytime().toUTCString(),
    updatedAt: faker.date.anytime().toUTCString(),
  };
});

export /**
 *
 */
const handlers = [
  // GET /tasks
  http.get(`${basePath}/tasks`, async () => {
    return HttpResponse.json(tasks);
  }),
  // GET /tasks/:id
  http.get<{
    /**
     *
     */
    id: string;
  }>(`${basePath}/tasks/:id`, async ({ params }) => {
    /**
     *
     */
    const { id } = params;
    /**
     *
     */
    const task = tasks.find((task) => task.id === id);
    return task
      ? HttpResponse.json(task, { status: 200 })
      : HttpResponse.json({ message: 'Task not found' }, { status: 404 });
  }),

  // POST /tasks
  http.post(`${basePath}/tasks`, async () => {
    return HttpResponse.json(null, { status: 201 });
  }),

  // PUT /tasks/:id
  http.put<{
    /**
     *
     */
    id: string;
  }>(`${basePath}/tasks/:id`, async ({ params }) => {
    /**
     *
     */
    const { id } = params;
    if (id) {
      return HttpResponse.json(null, { status: 200 });
    }
    return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
  }),

  // DELETE /tasks/:id
  http.delete<{
    /**
     *
     */
    id: string;
  }>(`${basePath}/tasks/:id`, async ({ params }) => {
    /**
     *
     */
    const { id } = params;
    if (id) {
      return HttpResponse.json(null, { status: 204 });
    }
    return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
  }),
];
