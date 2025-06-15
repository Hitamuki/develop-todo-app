using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EFCoreGenerator = ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Domain.Entities;

namespace ToDoApp.Infrastructure.Mappers
{
    public static class TaskMapper
    {
        public static EFCoreGenerator.Task ToEfCore(TaskEntity entity)
        {
            return new EFCoreGenerator.Task()
            {
                Id = entity.Id,
                UserId = entity.UserId,
                Title = entity.Title,
                Description = entity.Description,
                DueDate = entity.DueDate,
                StatusId = entity.StatusId,
                IsDeleted = entity.IsDeleted,
                CreatedAt = entity.CreatedAt,
                CreatedBy = entity.CreatedBy,
                UpdatedAt = entity.UpdatedAt,
                UpdatedBy = entity.UpdatedBy,
            };
        }

        public static TaskEntity ToEntity(EFCoreGenerator.Task efCoreTask)
        {
            return new TaskEntity
            {
                Id = efCoreTask.Id,
                UserId = efCoreTask.UserId,
                Title = efCoreTask.Title,
                Description = efCoreTask.Description,
                DueDate = efCoreTask.DueDate,
                StatusId = efCoreTask.StatusId,
                IsDeleted = efCoreTask.IsDeleted,
                CreatedAt = efCoreTask.CreatedAt,
                CreatedBy = efCoreTask.CreatedBy,
                UpdatedAt = efCoreTask.UpdatedAt,
                UpdatedBy = efCoreTask.UpdatedBy,
            };
        }
    }
}
