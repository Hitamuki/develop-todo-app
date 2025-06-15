using ToDoApp.Domain.Entities;

namespace ToDoApp.Domain.Interfaces.IRepository;

public interface IUserRepository
{
    Task<UserEntity> GetByIdAsync(Guid id);
    Task<UserEntity> GetByEmailAsync(string email);
    Task AddAsync(UserEntity userEntity);
}
