using Microsoft.OpenApi.Models;
// データアクセス層の名前空間
// サービス層の名前空間

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
//     options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// アプリケーションサービスの登録
// builder.Services.AddScoped<IDatabaseConnection, DatabaseConnection>();
// builder.Services.AddScoped<ITaskRepository, TaskRepository>();

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
