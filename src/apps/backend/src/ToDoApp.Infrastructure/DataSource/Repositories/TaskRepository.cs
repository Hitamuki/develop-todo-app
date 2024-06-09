using Dapper;
using Domain.Interfaces;
using MySql.Data.MySqlClient;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

public class TaskRepository : ITaskRepository
{
    private readonly IDatabaseConnection _databaseConnection;

    public TaskRepository(IDatabaseConnection databaseConnection)
    {
        _databaseConnection = databaseConnection;
    }

    public async Task<IEnumerable<TaskEntity>> GetAllAsync()
    {
        using (var connection = _databaseConnection.CreateConnection())
        {
            await connection.OpenAsync();
            
            string query = "SELECT * FROM Tasks";
            return await connection.QueryAsync<TaskEntity>(query);
        }
    }
}
