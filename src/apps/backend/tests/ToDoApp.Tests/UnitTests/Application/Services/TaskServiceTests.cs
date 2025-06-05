using Microsoft.Extensions.Logging;
using Moq;
using TodoApp.Application.Services;
using TodoApp.Domain.Interfaces.IRepository;
using ToDoApp.Tests.UnitTests.TestHelpers;
using Xunit;
using TodoApp.Domain.Entities;

namespace ToDoApp.Tests.UnitTests.Application.Services
{
    public class TaskServiceTests
    {
        private readonly Mock<ITaskRepository> _mockTaskRepository;
        private readonly Mock<ILogger<TaskService>> _mockLogger;
        private readonly TaskService _taskService;

        public TaskServiceTests()
        {
            // Setup mocks
            _mockTaskRepository = new Mock<ITaskRepository>();
            _mockLogger = new Mock<ILogger<TaskService>>();

            // Create instance of the service with mocked dependencies
            _taskService = new TaskService(_mockTaskRepository.Object, _mockLogger.Object);
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
            Assert.Equal(expectedTasks, actual);
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
            _mockTaskRepository.Verify(repo => repo.FindByIdAsync(taskId), Times.Once);
        }

        [Fact]
        public async Task CreateAsync_ShouldGenerateNewIdAndCallRepository()
        {
            // Arrange
            // Bogusを使用してIDなしのテストデータを生成
            var taskEntity = TaskEntityFaker.Generate();

            // テスト用にIDとUserIDをリセット
            taskEntity.Id = Guid.Empty;
            taskEntity.UserId = Guid.Empty;

            _mockTaskRepository.Setup(repo => repo.CreateAsync(It.IsAny<TaskEntity>()))
                .Returns(Task.CompletedTask);

            // Act
            await _taskService.CreateAsync(taskEntity);

            // Assert
            Assert.NotEqual(Guid.Empty, taskEntity.Id);
            Assert.NotEqual(Guid.Empty, taskEntity.UserId);
            _mockTaskRepository.Verify(
                repo => repo.CreateAsync(It.Is<TaskEntity>(t =>
                t.Id != Guid.Empty &&
                t.Title == taskEntity.Title &&
                t.Description == taskEntity.Description)), Times.Once);
        }

        [Fact]
        public async Task UpdateAsync_ShouldCallRepository()
        {
            // Arrange
            var taskId = Guid.NewGuid();
            var taskEntity = new TaskEntity
            {
                Id = taskId,
                Title = "Updated Task",
                Description = "Updated Description",
                StatusId = 2,
            };

            _mockTaskRepository.Setup(repo => repo.UpdateAsync(taskId, taskEntity))
                .Returns(Task.CompletedTask);

            // Act
            await _taskService.UpdateAsync(taskId, taskEntity);

            // Assert
            _mockTaskRepository.Verify(repo => repo.UpdateAsync(taskId, taskEntity), Times.Once);
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
            var actual = await _taskService.FindByIdAsync(taskId);

            // Assert
            Assert.Null(actual);
            _mockTaskRepository.Verify(repo => repo.FindByIdAsync(taskId), Times.Once);
        }
    }
}
