using TodoApp.Domain.Entities;

namespace TodoApp.Domain.Interfaces.IRepository;

public interface IUserRepository
{
    Task<UserEntity> GetByIdAsync(Guid id);
    Task<UserEntity> GetByUserNameAsync(string userName);
    Task AddAsync(UserEntity userEntity);
}
