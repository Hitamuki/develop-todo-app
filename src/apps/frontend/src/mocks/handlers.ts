import { http, HttpResponse, PathParams } from 'msw'; // Added PathParams
import { faker } from '@faker-js/faker';
import { sample, find } from 'lodash-es'; // Added find

// basePath for tasks (existing)
const tasksBasePath = 'https://localhost:7268/api/v1'; // Keep existing for tasks

// basePath for users, as per UsersService.ts
const usersBasePath = 'https://localhost:3000/api/v1';

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

// Mocked users database
let users: any[] = [];

export const handlers = [
  // === Task Handlers (existing) ===
  http.get(`${tasksBasePath}/tasks`, async () => {
    return HttpResponse.json(tasks);
  }),
  http.get<{ id: string }>(`${tasksBasePath}/tasks/:id`, async ({ params }) => {
    const { id } = params;
    const task = find(tasks, { id }); // Using find from lodash
    return task
      ? HttpResponse.json(task, { status: 200 })
      : HttpResponse.json({ message: 'Task not found' }, { status: 404 });
  }),
  http.post(`${tasksBasePath}/tasks`, async () => {
    return HttpResponse.json(null, { status: 201 });
  }),
  http.put<{ id: string }>(`${tasksBasePath}/tasks/:id`, async ({ params }) => {
    const { id } = params;
    if (id) { // Simplified check, actual update logic would be more complex
      return HttpResponse.json(null, { status: 200 });
    }
    return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
  }),
  http.delete<{ id: string }>(`${tasksBasePath}/tasks/:id`, async ({ params }) => {
    const { id } = params;
    if (id) { // Simplified check
      return HttpResponse.json(null, { status: 204 });
    }
    return HttpResponse.json({ message: 'Task not found' }, { status: 404 });
  }),

  // === User Handlers (new) ===
  // POST /users (User Registration)
  http.post(`${usersBasePath}/users`, async ({ request }) => {
    const newUser = await request.json() as any; // Type assertion
    if (!newUser.email || !newUser.password) {
      return HttpResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }
    if (find(users, { email: newUser.email })) { // Using find from lodash
      return HttpResponse.json({ message: 'User with this email already exists' }, { status: 409 }); // Conflict
    }
    const user = {
      id: newUser.email, // Using email as ID for simplicity in mock, like getUser
      name: newUser.name || faker.person.fullName(),
      email: newUser.email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    users.push(user);
    // The actual API for postUser returns an 'any' type with no specific body structure defined for success.
    // Often, a 201 Created will return the created resource or an empty body.
    // Let's return the created user object for now, which can be helpful for debugging.
    return HttpResponse.json(user, { status: 201 });
  }),

  // GET /users/:userId (Get User / Pseudo-Login)
  // Note: The UsersService uses userId in the path, which we are treating as email for login.
  http.get< { userId: string } >(`${usersBasePath}/users/:userId`, async ({ params }) => {
    const { userId } = params; // This will be the email address
    const user = find(users, { id: userId }); // Match against 'id' which we set to email

    if (user) {
      return HttpResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      } as any, { status: 200 }); // Cast to 'any' to match UserGetResponseDto structure if needed
    } else {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
  }),
];

// Helper function to reset users (optional, good for testing)
export const resetUsers = () => {
  users = [];
};
