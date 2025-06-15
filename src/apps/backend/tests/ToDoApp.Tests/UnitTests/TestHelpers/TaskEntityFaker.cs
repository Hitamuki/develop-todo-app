using Bogus;
using ToDoApp.Domain.Entities;

namespace ToDoApp.Tests.UnitTests.TestHelpers
{
    /// <summary>
    /// TaskEntityのテストデータを生成するためのFakerクラス
    /// </summary>
    public static class TaskEntityFaker
    {
        /// <summary>
        /// 単一のTaskEntityを生成します
        /// </summary>
        /// <param name="id">指定するID（nullの場合はランダム生成）</param>
        /// <returns>生成されたTaskEntity</returns>
        public static TaskEntity Generate(Guid? id = null)
        {
            var faker = new Faker<TaskEntity>()
                .RuleFor(t => t.Id, f => id ?? Guid.NewGuid())
                .RuleFor(t => t.Title, f => f.Lorem.Sentence(3, 2).TrimEnd('.'))
                .RuleFor(t => t.Description, f => f.Lorem.Paragraph(2))
                .RuleFor(t => t.StatusId, f => f.Random.Int(1, 3))
                .RuleFor(t => t.UserId, f => Guid.NewGuid())
                .RuleFor(t => t.CreatedAt, f => f.Date.Recent(7))
                .RuleFor(t => t.UpdatedAt, f => f.Date.Recent(3));

            return faker.Generate();
        }

        /// <summary>
        /// 複数のTaskEntityを生成します
        /// </summary>
        /// <param name="count">生成する数</param>
        /// <returns>生成されたTaskEntityのリスト</returns>
        public static List<TaskEntity> GenerateList(int count = 3)
        {
            var faker = new Faker<TaskEntity>()
                .RuleFor(t => t.Id, f => Guid.NewGuid())
                .RuleFor(t => t.Title, f => f.Lorem.Sentence(3, 2).TrimEnd('.'))
                .RuleFor(t => t.Description, f => f.Lorem.Paragraph(2))
                .RuleFor(t => t.StatusId, f => f.Random.Int(1, 3))
                .RuleFor(t => t.UserId, f => Guid.NewGuid())
                .RuleFor(t => t.CreatedAt, f => f.Date.Recent(7))
                .RuleFor(t => t.UpdatedAt, f => f.Date.Recent(3));

            return faker.Generate(count);
        }
    }
}
