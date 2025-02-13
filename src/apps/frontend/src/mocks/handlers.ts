import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { sample } from 'lodash-es';

export /**
 *
 */
const handlers = [
  http.get('https://localhost:7268/api/v1/tasks', () => {
    /**
     *
     */
    const tasks = Array.from({ length: 10 }).map((_, index) => {
      return {
        id: faker.string.uuid(),
        title: `Title ${index + 1}`,
        description: faker.word.sample(),
        dueDate: faker.date.anytime().toUTCString(),
        statusId: sample([1, 2, 3]),
        createdAt: faker.date.anytime().toUTCString(),
        updatedAt: faker.date.anytime().toUTCString(),
      };
    });
    return HttpResponse.json(tasks);
  }),
];
