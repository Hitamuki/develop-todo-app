using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using TodoApp.Application.Interfaces.IService;
using TodoApp.Application.Services;
using TodoApp.Domain.Interfaces.IRepository;
using TodoApp.Infrastructure.DataSource;
using TodoApp.Infrastructure.DataSource.Repositories;
using TodoApp.Infrastructure.EFCoreGenerator;

var corsPolicy = "_cross_origin"; // CORS ポリシー
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddCors(options =>
{
  options.AddPolicy(name: corsPolicy,
    policy =>
    {
      policy
      .WithOrigins("http://localhost:4200")
      .WithOrigins("https://localhost:4200")
      .AllowAnyHeader()
      .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// OpenAPIの設定
builder.Services.AddSwaggerGen(c =>
{
  c.SwaggerDoc("v1", new OpenApiInfo { Title = "ToDoApp API", Version = "v1" });
});

// データベースコンテキストの登録
builder.Services.AddDbContext<TodoContext>();
// builder.Services.AddDbContext<TodoContext>(options =>
//   options.UseMySql(builder.Configuration.GetConnectionString("TodoContext"),
//     ServerVersion.Parse("8.0.40-mysql")));

// サービスの登録
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

var app = builder.Build();

// Configure the HTTP request pipeline.
// 開発環境での設定
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI(options =>
  {
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "v1");
    options.RoutePrefix = string.Empty;
  });
}

// HTTPS リダイレクトを追加
app.UseHttpsRedirection();

// ルーティングを有効化
app.UseRouting();

app.UseCors(corsPolicy);

// 認可ミドルウェアを追加
app.UseAuthorization();

// コントローラーをエンドポイントにマップ
app.MapControllers();

// アプリケーションを実行
app.Run();