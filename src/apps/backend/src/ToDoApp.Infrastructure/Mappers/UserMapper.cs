using EFCoreGenerator = ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Domain.Entities;

namespace ToDoApp.Infrastructure.Mappers;

public static class UserMapper
{
    public static EFCoreGenerator.User ToEfCore(UserEntity entity)
    {
        if (entity == null) return null;
        return new EFCoreGenerator.User
        {
            Id = entity.Id,
            Name = entity.UserName, // Changed from UserName
            PasswordHash = entity.PasswordHash,
            Email = entity.Email,
            CreatedAt = entity.CreatedAt, // DateTime to DateTime? is fine
            UpdatedAt = entity.UpdatedAt  // DateTime to DateTime? is fine
            // Ensure all properties are mapped from UserEntity to EFCoreGenerator.User
        };
    }

    public static UserEntity ToEntity(EFCoreGenerator.User efCoreUser)
    {
        if (efCoreUser == null) return null;
        return new UserEntity
        {
            Id = efCoreUser.Id,
            UserName = efCoreUser.Name, // Changed from UserName
            PasswordHash = efCoreUser.PasswordHash,
            Email = efCoreUser.Email,
            CreatedAt = efCoreUser.CreatedAt ?? DateTime.MinValue, // Handle nullable DateTime?
            UpdatedAt = efCoreUser.UpdatedAt ?? DateTime.MinValue  // Handle nullable DateTime?
            // Ensure all properties are mapped from EFCoreGenerator.User to UserEntity
        };
    }
}
