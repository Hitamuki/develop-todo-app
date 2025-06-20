using Microsoft.Extensions.Logging;
using Moq;
using Org.OpenAPITools.Models;
using ToDoApp.Application.Interfaces;
using ToDoApp.Application.Services;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;
using ToDoApp.Tests.UnitTests.TestHelpers;

namespace ToDoApp.Tests.UnitTests.Application.Services;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _mockTaskRepository;
    private readonly Mock<ILogger<TaskService>> _mockLogger;
    private readonly Mock<IUserContext> _mockUserContext;
    private readonly TaskService _taskService;

    public TaskServiceTests()
    {
        // Setup mocks
        _mockTaskRepository = new Mock<ITaskRepository>();
        _mockLogger = new Mock<ILogger<TaskService>>();
        _mockUserContext = new Mock<IUserContext>();

        _mockUserContext.Setup(uc => uc.IsAuthenticated).Returns(true);
        _mockUserContext.Setup(uc => uc.UserId).Returns(Guid.NewGuid().ToString());

        _taskService = new TaskService(_mockTaskRepository.Object, _mockUserContext.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task SearchAsync_ShouldReturnAllTasks()
    {
        // Arrange
        // Bogusを使用してテストデータを生成
        var expectedTasks = TaskEntityFaker.GenerateList(2);

        _mockTaskRepository.Setup(repo => repo.SearchAsync())
            .ReturnsAsync(expectedTasks);

        // Act
        var actual = await _taskService.SearchAsync();

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(expectedTasks.Count, actual.Count());

        // 返却値の型が変わったため、Entityとの直接比較はできない
        var actualList = actual.ToList();
        for (int i = 0; i < expectedTasks.Count; i++)
        {
            Assert.Equal(expectedTasks[i].Id, actualList[i].Id);
            Assert.Equal(expectedTasks[i].Title, actualList[i].Title);
            Assert.Equal(expectedTasks[i].Description, actualList[i].Description);
        }

        _mockTaskRepository.Verify(repo => repo.SearchAsync(), Times.Once);
    }

    [Fact]
    public async Task FindByIdAsync_ShouldReturnTask_WhenTaskExists()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        // Bogusを使用して特定のIDを持つテストデータを生成
        var expectedTask = TaskEntityFaker.Generate(taskId);

        _mockTaskRepository.Setup(repo => repo.FindByIdAsync(taskId))
            .ReturnsAsync(expectedTask);

        // Act
        var actual = await _taskService.FindByIdAsync(taskId);

        // Assert
        Assert.NotNull(actual);
        Assert.Equal(expectedTask.Id, actual.Id);
        Assert.Equal(expectedTask.Title, actual.Title);
        Assert.Equal(expectedTask.Description, actual.Description);
        Assert.Equal((StatusIdEnum)expectedTask.StatusId, actual.StatusId);
        _mockTaskRepository.Verify(repo => repo.FindByIdAsync(taskId), Times.Once);
    }

    [Fact]
    public async Task CreateAsync_ShouldCallRepository()
    {
        // Arrange
        var taskPostRequestDto = new TaskPostRequestDto
        {
            Title = "Test Task",
            Description = "Test Description",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(7)),
            StatusId = StatusIdEnum._1Enum
        };

        _mockTaskRepository.Setup(repo => repo.CreateAsync(It.IsAny<TaskEntity>()))
            .Returns(Task.CompletedTask);

        // Act
        await _taskService.CreateAsync(taskPostRequestDto);

        // Assert
        _mockTaskRepository.Verify(
            repo => repo.CreateAsync(It.Is<TaskEntity>(t =>
            t.Id != Guid.Empty &&
            t.Title == taskPostRequestDto.Title &&
            t.Description == taskPostRequestDto.Description &&
            t.DueDate == taskPostRequestDto.DueDate &&
            t.StatusId == (int)taskPostRequestDto.StatusId)),
            Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_ShouldCallRepository()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var taskPutRequestDto = new TaskPutRequestDto
        {
            Title = "Updated Task",
            Description = "Updated Description",
            DueDate = DateOnly.FromDateTime(DateTime.Now.AddDays(7)),
            StatusId = StatusIdEnum._2Enum
        };

        _mockTaskRepository.Setup(repo => repo.UpdateAsync(It.IsAny<TaskEntity>()))
            .Returns(Task.CompletedTask);

        // Act
        await _taskService.UpdateAsync(taskId, taskPutRequestDto);

        // Assert
        _mockTaskRepository.Verify(
            repo => repo.UpdateAsync(It.Is<TaskEntity>(t =>
            t.Id == taskId &&
            t.Title == taskPutRequestDto.Title &&
            t.Description == taskPutRequestDto.Description &&
            t.DueDate == taskPutRequestDto.DueDate &&
            t.StatusId == (int)taskPutRequestDto.StatusId)),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_ShouldCallRepository()
    {
        // Arrange
        var taskId = Guid.NewGuid();

        _mockTaskRepository.Setup(repo => repo.DeleteAsync(taskId))
            .Returns(Task.CompletedTask);

        // Act
        await _taskService.DeleteAsync(taskId);

        // Assert
        _mockTaskRepository.Verify(repo => repo.DeleteAsync(taskId), Times.Once);
    }

    [Fact]
    public async Task FindByIdAsync_ShouldReturnNull_WhenTaskDoesNotExist()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        _mockTaskRepository.Setup(repo => repo.FindByIdAsync(taskId))
            .ReturnsAsync((TaskEntity)null); // Ensure the return type is correctly cast for Moq

        // Act
        var result = await _taskService.FindByIdAsync(taskId);

        // Assert
        Assert.Null(result);
        _mockTaskRepository.Verify(repo => repo.FindByIdAsync(taskId), Times.Once);
    }
}
