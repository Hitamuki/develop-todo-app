using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;
using TodoApp.Domain.Interfaces.IRepository;
using ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Infrastructure.Mappers;

namespace ToDoApp.Infrastructure.DataSource.Repositories;

public class UserRepository : IUserRepository
{
    private readonly TodoContext _context;

    public UserRepository(TodoContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<UserEntity> GetByIdAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        return user == null ? null : UserMapper.ToEntity(user);
    }

    public async Task<UserEntity> GetByUserNameAsync(string userName)
    {
        // EFCoreGenerator.User uses 'Name' property for the user's name.
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Name == userName);
        return user == null ? null : UserMapper.ToEntity(user);
    }

    public async Task AddAsync(UserEntity userEntity)
    {
        if (userEntity == null) throw new ArgumentNullException(nameof(userEntity));

        var user = UserMapper.ToEfCore(userEntity);
        // Ensure required fields for DB are set if UserMapper doesn't cover them
        // e.g. if EFCoreGenerator.User has non-nullable fields not in UserEntity
        // For now, assume UserMapper handles all necessary direct mappings.

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
}
