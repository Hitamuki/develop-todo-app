using Microsoft.OpenApi.Models;
using TodoApp.Application.Interfaces.IService;
using TodoApp.Application.Services;
using TodoApp.Domain.Interfaces.IRepository;
using TodoApp.Infrastructure.DataSource.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// OpenAPIの設定
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ToDoApp API", Version = "v1" });
});

// データベースコンテキストの登録（例: Entity Framework Core）
// builder.Services.AddDbContext<YourDbContext>(options =>
// options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// サービスの登録
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// 開発環境での設定
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    _ = endpoints.MapControllers();
});

app.Run();
