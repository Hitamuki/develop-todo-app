using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces.IRepository;

public interface IUserRepository
{
    Task<UserEntity> GetByIdAsync(Guid id);
    Task AddAsync(UserEntity userEntity);
}
