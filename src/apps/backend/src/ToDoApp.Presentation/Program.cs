using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TodoApp.Application.Interfaces.IService;
using ToDoApp.Application.Interfaces;
using ToDoApp.Application.Interfaces.IService;
using ToDoApp.Application.Services;
using ToDoApp.Domain.Entities;
using ToDoApp.Domain.Interfaces.IRepository;
using ToDoApp.Infrastructure.DataSource.Repositories;
using ToDoApp.Infrastructure.EFCoreGenerator;
using ToDoApp.Infrastructure.Services;
using ToDoApp.Presentation.Services;

const string corsPolicy = "_cross_origin";
var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        name: corsPolicy,
        policy =>
        {
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

// JWTの設定
var jwtSettings = builder.Configuration.GetSection("Jwt");
var secretKey = jwtSettings["Secret"];
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = true;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        // ClockSkew = TimeSpan.Zero, // トークンの有効期限に厳密にしたいとき
    };
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();

// HttpContextAccessorの登録
builder.Services.AddHttpContextAccessor();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();

// OpenAPIの設定
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ToDoApp API", Version = "v1" });
});

// データベースコンテキストの登録
builder.Services.AddDbContext<TodoContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("TodoContext"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("TodoContext"))));

// サービスの登録
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher<UserEntity>, PasswordHasher<UserEntity>>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserContext, HttpUserContext>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
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

// 認証ミドルウェア
app.UseAuthentication();

// 認可ミドルウェア
app.UseAuthorization();

// コントローラーをエンドポイントにマップ
app.MapControllers();

// アプリケーションを実行
app.Run();
