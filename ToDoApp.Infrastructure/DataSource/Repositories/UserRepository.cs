using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using TodoApp.Domain.Interfaces.IRepository;
using ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Infrastructure.Mappers; // Assuming UserMapper will be created here

namespace ToDoApp.Infrastructure.DataSource.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TodoContext _context;

    public UserRepository(TodoContext context)
    {
        _context = context;
    }

    public async Task<UserEntity> GetByIdAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        return user == null ? null : UserMapper.ToEntity(user); // Assuming UserMapper.ToEntity exists
    }

    public async Task<UserEntity> GetByUserNameAsync(string userName)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.UserName == userName);
        return user == null ? null : UserMapper.ToEntity(user); // Assuming UserMapper.ToEntity exists
    }

    public async Task AddAsync(UserEntity userEntity)
    {
        var user = UserMapper.ToEfCore(userEntity); // Assuming UserMapper.ToEfCore exists
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
}
