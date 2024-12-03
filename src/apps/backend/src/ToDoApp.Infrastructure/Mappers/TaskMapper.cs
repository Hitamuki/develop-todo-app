using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain.Entities;

namespace TodoApp.Infrastructure.Mappers
{
  public class TaskMapper
  {
    public static EFCoreGenerator.Task ToEfCore(TaskEntity entity)
    {
      return new EFCoreGenerator.Task()
      {
        Id = entity.Id,
      };
    }

    public static TaskEntity ToEntity(EFCoreGenerator.Task efCoreTask)
    {
      return new TaskEntity
      {
        Id = efCoreTask.Id,
      };
    }
  }
}