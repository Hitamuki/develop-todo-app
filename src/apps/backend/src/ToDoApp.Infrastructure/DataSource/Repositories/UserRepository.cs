using Microsoft.EntityFrameworkCore;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;
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

    public async System.Threading.Tasks.Task<UserEntity> GetByIdAsync(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        return user == null ? null : UserMapper.ToEntity(user);
    }

    public async System.Threading.Tasks.Task<UserEntity> GetByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(x => x.Email == email);
        return user == null ? null : UserMapper.ToEntity(user);
    }

    public async System.Threading.Tasks.Task AddAsync(UserEntity userEntity)
    {
        if (userEntity == null) throw new ArgumentNullException(nameof(userEntity));

        var user = UserMapper.ToEfCore(userEntity);

        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
    }
}
